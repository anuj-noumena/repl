import {
  type ToRefs,
  type UnwrapRef,
  computed,
  reactive,
  ref,
  shallowRef,
  watch,
  watchEffect,
  version as _vueVersion,
} from 'vue'
import * as defaultCompiler from 'vue/compiler-sfc'
import { compileFile } from './transform'
import { atou, utoa } from './utils'
import type {
  SFCAsyncStyleCompileOptions,
  SFCScriptCompileOptions,
  SFCTemplateCompileOptions,
} from 'vue/compiler-sfc'
import type { OutputModes } from './types'
import type { editor } from 'monaco-editor-core'
import { type ImportMap, mergeImportMap, useVueImportMap } from './import-map'

export const importMapFile = 'import-map.json'
export const tsconfigFile = 'tsconfig.json'

const createFiles = (contentType: number, content: string) => {
  switch (contentType) {
    case 0:
      const parser = new DOMParser()
      const doc = parser.parseFromString(content, 'text/html')

      const styleTag = doc.querySelector('style')?.innerHTML.trim()
      const templateTag = doc.querySelector('template')?.innerHTML.trim()
      const setupTag = doc.querySelector('script[setup]')?.innerHTML.trim()
      const scriptTag = doc.querySelector('script:not([setup]):not([template])')?.innerHTML.trim()
      // page
      return {
        preview: 'Main.vue',
        activeFilename: 'Setup.js',
        files: {
          'Main.vue': new File('Main.vue', '', true, 'javascript'),
          'Script.js': new File('Script.js', scriptTag, false, 'javascript'),
          'Setup.js': new File('Setup.js', setupTag, false, 'javascript'),
          'Template.js': new File('Template.js', templateTag, false, 'javascript'),
          'Style.css': new File('Style.css', styleTag, false, 'scss'),
        },
      }
    case 1:
      // html
      return {
        preview: 'Main.html',
        activeFilename: 'Main.html',
        files: {
          'Main.html': new File('Main.html', content, false, 'html'),
        },
      }
    case 2:
      // javascript
      return {
        preview: false,
        activeFilename: 'Main.js',
        files: {
          'Main.js': new File('Main.js', content, false, 'javascript'),
        },
      }
    case 3:
      // css
      return {
        preview: false,
        activeFilename: 'Main.css',
        files: {
          'Main.css': new File('Main.css', content, false, 'scss'),
        },
      }
    case 4:
      // json
      return {
        preview: false,
        activeFilename: 'Main.json',
        files: {
          'Main.json': new File('Main.json', content, false, 'json'),
        },
      }
  }
  return {
    preview: 'Main.vue',
    activeFilename: 'Main.vue',
    files: {
      'Main.vue': new File('Main.vue', content, true, 'javascript'),
    },
  }
}

export function useStore(
  {
    contentId = ref('test'),
    contentType = ref(0),
    content = ref(''),

    builtinImportMap = undefined!, // set later

    errors = ref([]),
    outputMode = ref('preview'),
    sfcOptions = ref({}),

    locale = ref(),
    typescriptVersion = ref('latest'),
    dependencyVersion = ref(Object.create(null)),
    reloadLanguageTools = ref(),
  }: Partial<StoreState> = {},
  serializedState?: string,
): ReplStore {
  const vueVersion = ref(_vueVersion)
  if (!builtinImportMap) {
    ;({ importMap: builtinImportMap } = useVueImportMap({
      vueVersion: vueVersion.value,
    }))
  }

  const showOutput = ref(false)
  const loading = ref(false)
  const compiler = shallowRef(defaultCompiler)
  const activeFilename = ref('')

  const preview = ref<string | boolean>(false)
  const files = ref<Record<string, File>>({})
  const _o1 = createFiles(contentType.value, content.value)
  preview.value = _o1.preview
  activeFilename.value = _o1.activeFilename
  files.value = Object.fromEntries(
    Object.entries(_o1.files).filter(([_, file]) => file !== undefined),
  )

  function applyBuiltinImportMap() {
    const importMap = mergeImportMap(builtinImportMap.value, getImportMap())
    setImportMap(importMap)
  }

  function init() {
    watchEffect(() => {
      compileFile(store).then((errs) => (errors.value = errs))
    })

    watch(
      builtinImportMap,
      () => {
        setImportMap(mergeImportMap(getImportMap(), builtinImportMap.value))
      },
      { deep: true },
    )
    if (!files.value[tsconfigFile]) {
      files.value[tsconfigFile] = new File(
        tsconfigFile,
        JSON.stringify(tsconfig, undefined, 2),
        true,
        'json',
      )
    }
    // compile rest of the files
    errors.value = []
    compileFile(store).then((errs) => errors.value.push(...errs))
  }

  function setImportMap(map: ImportMap) {
    if (map.imports)
      for (const [key, value] of Object.entries(map.imports)) {
        if (value) {
          map.imports![key] = fixURL(value)
        }
      }

    const code = JSON.stringify(map, undefined, 2)
    if (files.value[importMapFile]) {
      files.value[importMapFile].code = code
    } else {
      files.value[importMapFile] = new File(importMapFile, code)
    }
  }

  const setActive: Store['setActive'] = (filename) => {
    activeFilename.value = filename
  }

  const getImportMap: Store['getImportMap'] = () => {
    try {
      return JSON.parse(files.value[importMapFile].code)
    } catch (e) {
      errors.value = [
        `Syntax error in ${importMapFile}: ${(e as Error).message}`,
      ]
      return {}
    }
  }
  const getTsConfig: Store['getTsConfig'] = () => {
    try {
      return JSON.parse(files.value[tsconfigFile].code)
    } catch {
      return {}
    }
  }

  const activeFile = computed(() => files.value[activeFilename.value])
  const mainFile = computed(() =>
    typeof preview.value == 'string' ? preview.value : '',
  )
  applyBuiltinImportMap()
  const getContent = () => {
    return Object.fromEntries(
      Object.entries(files.value).map(([key, file]) => [
        key,
        file.code ? atou(file.code) : '',
      ]),
    )
  }

  const setContent = async (
    _contentType: number,
    _contentId: string,
    _content: string,
  ) => {
    const _o2 = createFiles(_contentType, _content)
    preview.value = _o2.preview
    activeFilename.value = _o2.activeFilename
    contentId.value = _contentId
    content.value = _content
    contentType.value = _contentType
    files.value = Object.fromEntries(
      Object.entries(_o2.files).filter(([_, file]) => file !== undefined),
    )
    errors.value = []
    compileFile(store).then((errs) => errors.value.push(...errs))
  }
  const store: ReplStore = reactive({
    files,
    mainFile,
    preview,
    content,
    contentType,
    contentId,
    getContent,
    setContent,

    activeFile,
    activeFilename,
    builtinImportMap,

    errors,
    showOutput,
    outputMode,
    sfcOptions,
    compiler,
    loading,
    vueVersion,

    locale,
    typescriptVersion,
    dependencyVersion,
    reloadLanguageTools,

    init,
    setActive,
    getImportMap,
    getTsConfig,
  })
  return store
}

const tsconfig = {
  compilerOptions: {
    allowJs: true,
    checkJs: true,
    jsx: 'Preserve',
    target: 'ESNext',
    module: 'ESNext',
    moduleResolution: 'Bundler',
    allowImportingTsExtensions: true,
  },
  vueCompilerOptions: {
    target: 3.5,
  },
}

export interface SFCOptions {
  script?: Partial<SFCScriptCompileOptions>
  style?: Partial<SFCAsyncStyleCompileOptions>
  template?: Partial<SFCTemplateCompileOptions>
}

export type StoreState = ToRefs<{
  content: string
  contentType: number
  contentId: string
  activeFilename: string
  builtinImportMap: ImportMap

  // output
  errors: (string | Error)[]
  showOutput: boolean
  outputMode: OutputModes
  sfcOptions: SFCOptions
  /** `@vue/compiler-sfc` */
  compiler: typeof defaultCompiler
  /* only apply for compiler-sfc */
  vueVersion: string | null

  // volar-related
  locale: string | undefined
  typescriptVersion: string
  /** \{ dependencyName: version \} */
  dependencyVersion: Record<string, string>
  reloadLanguageTools?: (() => void) | undefined
}>

export interface ReplStore extends UnwrapRef<StoreState> {
  files: Record<string, File>
  activeFile: File
  mainFile: string
  preview: string | boolean
  /** Loading compiler */
  loading: boolean
  init(): void
  setActive(filename: string): void
  getImportMap(): ImportMap
  getTsConfig(): Record<string, any>
  getContent(): Record<string, string>
  setContent(
    contentType: number,
    contentId: string,
    content: string,
  ): Promise<void>
}

export type Store = Pick<
  ReplStore,
  | 'preview'
  | 'files'
  | 'activeFile'
  | 'mainFile'
  | 'errors'
  | 'showOutput'
  | 'outputMode'
  | 'sfcOptions'
  | 'compiler'
  | 'vueVersion'
  | 'locale'
  | 'typescriptVersion'
  | 'dependencyVersion'
  | 'reloadLanguageTools'
  | 'init'
  | 'setActive'
  | 'content'
  | 'contentType'
  | 'contentId'
  | 'getImportMap'
  | 'getTsConfig'
>

export class File {
  compiled = {
    js: '',
    css: '',
  }
  editorViewState: editor.ICodeEditorViewState | null = null

  constructor(
    public filename: string,
    public code = '',
    public hidden = false,
    public language = 'javascript',
  ) {}
  //tsx, html, css, scss, typescript, javascript, jsx
  // get language() {

  //   if (this.filename.endsWith('.vue')) {
  //     return 'jsx'
  //   }
  //   if (this.filename.endsWith('.html')) {
  //     return 'html'
  //   }
  //   if (this.filename.endsWith('.css')) {
  //     return 'scss'
  //   }
  //   if (this.filename.endsWith('.ts')) {
  //     return 'typescript'
  //   }
  //   return 'javascript'
  //  }
}

function addSrcPrefix(file: string) {
  return file === importMapFile ||
    file === tsconfigFile ||
    file.startsWith('src/')
    ? file
    : `src/${file}`
}

export function stripSrcPrefix(file: string) {
  return file.replace(/^src\//, '')
}

function fixURL(url: string) {
  return url.replace('https://sfc.vuejs', 'https://play.vuejs')
}

function setFile(
  files: Record<string, File>,
  filename: string,
  content: string,
) {
  const normalized = addSrcPrefix(filename)
  files[normalized] = new File(normalized, content)
}
