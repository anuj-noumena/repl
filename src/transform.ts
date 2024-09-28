import { type Store } from './store'
// @ts-expect-error
import { compileSFC } from '@unimindsoftware/plugin-vue/compiler'

export async function compileCode(code: any, fileName: any, isSFC: Boolean) {
  return await compileSFC(fileName, code, {
    isSFC,
    inlineTemplate: false,
    extraExportConfig: { disableReplaceVUEExport: true },
  })
}

const compileSFCContent = async (store: Store) => {
  const template =
    store.files['Template.js'].code?.trim().replace(/;+$/, '') || 'null'
  const style = store.files['Style.css'].code
  const setup = store.files['Setup.js'].code
  const script = store.files['Script.js'].code

  const code = `<script lang="jsx">
/** @ts-ignore **/
${script}
</script>
<script setup lang="jsx">
/** @ts-ignore **/
${setup}
</script>
<template lang="jsx">
${template}
</template>
<style scoped lang="scss">
${style || ''}
</style>`
  const { compiled, errors } = await compileSFC(
    store.contentId,
    {
      template,
      style,
      setup,
      script,
    },
    {
      isSFC: true,
      inlineTemplate: false,
      extraExportConfig: { disableReplaceVUEExport: true },
    },
  )
  if (compiled) {
    store.files['Main.vue'].compiled.js = compiled
    store.files['Main.vue'].code = code
  }
  return errors
}

export async function compileFile(store: Store): Promise<(string | Error)[]> {
  if (store.preview && typeof store.preview === 'string') {
    switch (store.contentType) {
      case 0:
        return await compileSFCContent(store)
      // case 1:
      //   return await compileCode(store.preview)
      // case 2:
      //   return await compileCode(store.preview)
      // case 3:
      //   return await compileCode(store.preview, store.activeFilename, false)
      // case 4:
      //   return await compileCode(store.preview, store.activeFilename, false)
    }
  }
  return []
}
