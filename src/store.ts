import {
  type ToRefs,
  type UnwrapRef,
  computed,
  reactive,
  ref,
  shallowRef,
  watch,
  watchEffect,
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

import welcomeSFCCode from './template/welcome.vue?raw'
import newSFCCode from './template/new-sfc.vue?raw'

export const importMapFile = 'import-map.json'
export const tsconfigFile = 'tsconfig.json'

export function useStore(
  {
    files = ref({
      'Setup.js': new File('Setup.js', ''),
      'Script.js': new File('Script.js', ''),
      'Template.js': new File('Template.js', ''),
      'Style.css': new File('Style.css', ''),
      'Main.vue': new File('Main.vue', '', true),
    }),
    
    activeFilename = undefined!, // set later
    mainFile = ref('Main.vue'),
    template = ref({
      welcomeSFC: welcomeSFCCode,
      newSFC: newSFCCode,
    }),
    builtinImportMap = undefined!, // set later

    errors = ref([]),
    showOutput = ref(false),
    outputMode = ref('preview'),
    sfcOptions = ref({}),
    compiler = shallowRef(defaultCompiler),
    vueVersion = ref(null),

    locale = ref(),
    typescriptVersion = ref('latest'),
    dependencyVersion = ref(Object.create(null)),
    reloadLanguageTools = ref(),
  }: Partial<StoreState> = {},
  serializedState?: string,
): ReplStore {
  if (!builtinImportMap) {
    ;({ importMap: builtinImportMap, vueVersion } = useVueImportMap({
      vueVersion: vueVersion.value,
    }))
  }
  const loading = ref(false)

  function applyBuiltinImportMap() {
    const importMap = mergeImportMap(builtinImportMap.value, getImportMap())
    setImportMap(importMap)
  }

  function init() {
    watchEffect(() => {
      compileFile(store).then((errs) => (errors.value = errs))
    })

    watch(
      () => [
        files.value[tsconfigFile]?.code,
        typescriptVersion.value,
        locale.value,
        dependencyVersion.value,
        vueVersion.value,
      ],
      () => reloadLanguageTools.value?.(),
      { deep: true },
    )

    watch(
      builtinImportMap,
      () => {
        setImportMap(mergeImportMap(getImportMap(), builtinImportMap.value))
      },
      { deep: true },
    )

    // watch(
    //   vueVersion,
    //   async (version) => {
    //     if (version) {
    //       const compilerUrl = `https://cdn.jsdelivr.net/npm/@vue/compiler-sfc@${version}/dist/compiler-sfc.esm-browser.js`
    //       loading.value = true
    //       compiler.value = await import(/* @vite-ignore */ compilerUrl).finally(
    //         () => (loading.value = false),
    //       )
    //       console.info(`[@vue/repl] Now using Vue version: ${version}`)
    //     } else {
    //       // reset to default
    //       compiler.value = defaultCompiler
    //       console.info(`[@vue/repl] Now using default Vue version`)
    //     }
    //   },
    //   { immediate: true },
    // )

    watch(
      sfcOptions,
      () => {
        sfcOptions.value.script ||= {}
        sfcOptions.value.script.fs = {
          fileExists(file: string) {
            if (file.startsWith('/')) file = file.slice(1)
            return !!store.files[file]
          },
          readFile(file: string) {
            if (file.startsWith('/')) file = file.slice(1)
            return store.files[file].code
          },
        }
      },
      { immediate: true },
    )

    // init tsconfig
    if (!files.value[tsconfigFile]) {
      files.value[tsconfigFile] = new File(
        tsconfigFile,
        JSON.stringify(tsconfig, undefined, 2),
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
  const serialize: ReplStore['serialize'] = () => {
    const files = getFiles()
    const importMap = files[importMapFile]
    if (importMap) {
      const parsed = JSON.parse(importMap)
      const builtin = builtinImportMap.value.imports || {}

      if (parsed.imports) {
        for (const [key, value] of Object.entries(parsed.imports)) {
          if (builtin[key] === value) {
            delete parsed.imports[key]
          }
        }
        if (parsed.imports && !Object.keys(parsed.imports).length) {
          delete parsed.imports
        }
      }
      if (parsed.scopes && !Object.keys(parsed.scopes).length) {
        delete parsed.scopes
      }
      if (Object.keys(parsed).length) {
        files[importMapFile] = JSON.stringify(parsed, null, 2)
      } else {
        delete files[importMapFile]
      }
    }
    if (vueVersion.value) files._version = vueVersion.value
    return '#' + utoa(JSON.stringify(files))
  }
  const deserialize: ReplStore['deserialize'] = (serializedState: string) => {
    if (serializedState.startsWith('#'))
      serializedState = serializedState.slice(1)
    let saved: any
    try {
      saved = JSON.parse(atou(serializedState))
    } catch (err) {
      console.error(err)
      alert('Failed to load code from URL.')
      return setDefaultFile()
    }
    for (const filename in saved) {
      if (filename === '_version') {
        vueVersion.value = saved[filename]
      } else {
        setFile(files.value, filename, saved[filename])
      }
    }
  }
  const getFiles: ReplStore['getFiles'] = () => {
    const exported: Record<string, string> = {}
    for (const [filename, file] of Object.entries(files.value)) {
      const normalized = stripSrcPrefix(filename)
      exported[normalized] = file.code
    }
    return exported
  }
  const setFiles: ReplStore['setFiles'] = async (
    newFiles,
    mainFile = store.mainFile,
  ) => {
    const files: Record<string, File> = Object.create(null)

    mainFile = addSrcPrefix(mainFile)
    if (!newFiles[mainFile]) {
      setFile(files, mainFile, '')
    }
    for (const [filename, file] of Object.entries(newFiles)) {
      setFile(files, filename, file)
    }

    const errors = []
    errors.push(...(await compileFile(store)))

    store.mainFile = mainFile
    store.files = files
    store.errors = errors
    applyBuiltinImportMap()
    setActive(store.mainFile)
  }
  const setDefaultFile = (): void => {
    setFile(files.value, mainFile.value, '')
  }

  if (serializedState) {
    deserialize(serializedState)
  } else {
    //setDefaultFile()
  }
  if (!files.value[mainFile.value]) {
    mainFile.value = Object.keys(files.value)[0]
  }
  activeFilename ||= ref('Setup.js')
  const activeFile = computed(() => files.value[activeFilename.value])

  applyBuiltinImportMap()

  const store: ReplStore = reactive({
    files,
    activeFile,
    activeFilename,
    mainFile,
    template,
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
    serialize,
    deserialize,
    getFiles,
    setFiles,
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
  files: Record<string, File>
  activeFilename: string
  mainFile: string
  template: {
    welcomeSFC?: string
    newSFC?: string
  }
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
  activeFile: File
  /** Loading compiler */
  loading: boolean
  init(): void
  setActive(filename: string): void
  getImportMap(): ImportMap
  getTsConfig(): Record<string, any>
  serialize(): string
  deserialize(serializedState: string): void
  getFiles(): Record<string, string>
  setFiles(newFiles: Record<string, string>, mainFile?: string): Promise<void>
}

export type Store = Pick<
  ReplStore,
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
  | 'getImportMap'
  | 'getTsConfig'
>

export class File {
  compiled = {
    js: '',
    css: '',
    ssr: '',
  }
  editorViewState: editor.ICodeEditorViewState | null = null

  constructor(
    public filename: string,
    public code = '',
    public hidden = false,
  ) {}

  get language() {
    
    if (this.filename.endsWith('.vue')) {
      return 'jsx'
    }
    if (this.filename.endsWith('.html')) {
      return 'html'
    }
    if (this.filename.endsWith('.css')) {
      return 'scss'
    }
    if (this.filename.endsWith('.ts')) {
      return 'typescript'
    }
    return 'javascript'
  }
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
