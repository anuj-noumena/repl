<script setup lang="ts">
// @ts-expect-error
import cloneDeep from 'lodash-es/cloneDeep'
import Message from '../Message.vue'
// @ts-expect-error
import * as loaderModule from /*@vite-ignore*/ '@unimindsoftware/app-loader'
// @ts-expect-error
import { useAppState, useRoute } from '@unimindsoftware/core'

import {
  type WatchStopHandle,
  inject,
  onMounted,
  onUnmounted,
  ref,
  useTemplateRef,
  watch,
  watchEffect,
} from 'vue'
import srcdoc from './srcdoc.html?raw'
import { PreviewProxy } from './PreviewProxy'
import { compileContainer, compileModulesForPreview } from './moduleCompiler'
import { injectKeyProps } from '../../src/types'

// Extend the Window interface to include _UniMindUIApp
declare global {
  interface Window {
    _UniMindUIApp?: {
      config: {
        globalProperties: {
          $appConfig: {
            appLoader: Function
          }
        }
      }
    }
  }
}
const props = defineProps<{ show: boolean; }>()

const { store, clearConsole, theme, previewTheme, previewOptions } =
  inject(injectKeyProps)!

const containerRef = useTemplateRef('container')
const runtimeError = ref<string>()
const runtimeWarning = ref<string>()

let sandbox: HTMLIFrameElement
let proxy: PreviewProxy
let stopUpdateWatcher: WatchStopHandle | undefined

// create sandbox on mount
onMounted(createSandbox)

// reset sandbox when import map changes
watch(
  () => store.value.getImportMap(),
  () => {
    try {
      createSandbox()
    } catch (e: any) {
      store.value.errors = [e as Error]
      return
    }
  },
)

function switchPreviewTheme() {
  if (!previewTheme.value) return

  const html = sandbox.contentDocument?.documentElement
  if (html) {
    html.className = theme.value
  } else {
    // re-create sandbox
    createSandbox()
  }
}

// reset theme
watch([theme, previewTheme], switchPreviewTheme)

onUnmounted(() => {
  proxy?.destroy()
  stopUpdateWatcher && stopUpdateWatcher()
})
const initState = {
  authToken: '',
  contentId: '',
  langCode: '',
  tenantCode: '',
  userName: '',
}
const initRoute = {
  fullPath: '/s/en-us/test45',
  hash: '',
  href: '#/s/en-us/test45',
  matched: [],
  meta: {},
  name: 'default',
  params: { tenantCode: 's', langCode: 'en-us', contentId: 'test45' },
  path: '/s/en-us/test45',
  query: {},
}

{
  const { authToken, contentId, langCode, tenantCode, userName } = useAppState()
  initState.authToken = authToken.value
  initState.contentId = contentId.value
  initState.langCode = langCode.value
  initState.tenantCode = tenantCode.value
  initState.userName = userName.value
}
{
  const { fullPath, hash, href, meta, name, params, path, query } = useRoute()

  initRoute.fullPath = fullPath
  initRoute.hash = hash
  initRoute.href = href
  initRoute.matched = []
  initRoute.meta = meta
  initRoute.name = name
  initRoute.params = params
  initRoute.path = path
  initRoute.query = query
}


async function createSandbox() {
  const containerCode = await compileContainer(store.value)
  if (sandbox) {
    // clear prev sandbox
    proxy.destroy()
    stopUpdateWatcher && stopUpdateWatcher()
    containerRef.value?.removeChild(sandbox)
  }

  sandbox = document.createElement('iframe')
  sandbox.setAttribute(
    'sandbox',
    [
      'allow-forms',
      'allow-modals',
      'allow-pointer-lock',
      'allow-popups',
      'allow-same-origin',
      'allow-scripts',
      'allow-top-navigation-by-user-activation',
    ].join(' '),
  )

  const importMap = store.value.getImportMap()

  importMap.imports = {
    ...importMap.imports,
    ...loaderModule.importMaps,
  }
  
  const sandboxSrc = srcdoc
    .replace(
      /<html>/,
      `<html class="${previewTheme.value ? theme.value : ''}">`,
    )
    .replace(/<!--IMPORT_MAP-->/, JSON.stringify(importMap))
    .replace(/<!--INIT_CODE-->/, containerCode + '\n' + `invokeLoader(${JSON.stringify(initState)}, ${JSON.stringify(initRoute)})`)
    .replace(
      /<!-- PREVIEW-OPTIONS-HEAD-HTML -->/,
      previewOptions.value?.headHTML || '',
    )
    .replace(
      /<!--PREVIEW-OPTIONS-PLACEHOLDER-HTML-->/,
      previewOptions.value?.placeholderHTML || '',
    )
  sandbox.srcdoc = sandboxSrc
  containerRef.value?.appendChild(sandbox)

  proxy = new PreviewProxy(sandbox, {
    on_fetch_progress: (progress: any) => {
      // pending_imports = progress;
    },
    on_error: (event: any) => {
      const msg =
        event.value instanceof Error ? event.value.message : event.value
      if (
        msg.includes('Failed to resolve module specifier') ||
        msg.includes('Error resolving module specifier')
      ) {
        runtimeError.value =
          msg.replace(/\. Relative references must.*$/, '') +
          `.\nTip: edit the "Import Map" tab to specify import paths for dependencies.`
      } else {
        runtimeError.value = event.value
      }
    },
    on_unhandled_rejection: (event: any) => {
      let error = event.value
      if (typeof error === 'string') {
        error = { message: error }
      }
      runtimeError.value = 'Uncaught (in promise): ' + error.message
    },
    on_console: (log: any) => {
      if (log.duplicate) {
        return
      }
      if (log.level === 'error') {
        if (log.args[0] instanceof Error) {
          runtimeError.value = log.args[0].message
        } else {
          runtimeError.value = log.args[0]
        }
      } else if (log.level === 'warn') {
        if (log.args[0].toString().includes('[Vue warn]')) {
          runtimeWarning.value = log.args
            .join('')
            .replace(/\[Vue warn\]:/, '')
            .trim()
        }
      }
    },
    on_console_group: (action: any) => {
      // group_logs(action.label, false);
    },
    on_console_group_end: () => {
      // ungroup_logs();
    },
    on_console_group_collapsed: (action: any) => {
      // group_logs(action.label, true);
    },
  })

  sandbox.addEventListener('load', () => {
    proxy.handle_links()
    stopUpdateWatcher = watchEffect(updatePreview)
    switchPreviewTheme()
  })
}

async function updatePreview() {
  if (import.meta.env.PROD && clearConsole.value) {
    console.clear()
  }
  runtimeError.value = undefined
  runtimeWarning.value = undefined



  try {
    const { mainFile } = store.value

    // compile code to simulated module system
    const modules = await compileModulesForPreview(store.value)
    console.info(
      `[@vue/repl] successfully compiled ${modules.length} module${
        modules.length > 1 ? `s` : ``
      }.`,
    )

    const codeToEval = [
      `window.__modules__ = {};window.__css__ = [];`,
        //`if (window._UniMindUIApp) {try{window._UniMindUIApp.unmount();}catch(e){console.clear()};}` +
      ...modules,
      `setTimeout(()=> {
        window._appLoader__reload?.()
        document.querySelectorAll('style[css]').forEach(el => el.remove())
        document.head.insertAdjacentHTML('beforeend', window.__css__.map(s => \`<style css>\${s}</style>\`).join('\\n'))
      }, 1)`,
    ]

    // if main file is a vue file, mount it.
    if (mainFile.endsWith('.vue')) {
      codeToEval.push(
        `${previewOptions.value?.customCode?.importCode || ''}
        
          ${previewOptions.value?.customCode?.useCode || ''}
        `,
      )
    }

    // eval code in sandbox
    await proxy.eval(codeToEval)
  } catch (e: any) {
    runtimeError.value = (e as Error).message
  }
}

/**
 * Reload the preview iframe
 */
function reload() {
  sandbox.contentWindow?.location.reload()
}

defineExpose({ reload, container: containerRef })
</script>

<template>
  <div
    v-show="show"
    ref="container"
    class="iframe-container"
    :class="{ [theme]: previewTheme }"
  />
  <Message :err="(previewOptions?.showRuntimeError ?? true) && runtimeError" />
  <Message
    v-if="!runtimeError && (previewOptions?.showRuntimeWarning ?? true)"
    :warn="runtimeWarning"
  />
</template>

<style scoped>
.iframe-container,
.iframe-container :deep(iframe) {
  width: 100%;
  height: 100%;
  border: none;
  background-color: #fff;
}
.iframe-container.dark :deep(iframe) {
  background-color: #1e1e1e;
}
</style>
