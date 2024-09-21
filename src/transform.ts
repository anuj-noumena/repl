import { File, type Store } from './store'
// @ts-expect-error
import { compileSFC } from '@unimindsoftware/plugin-vue/compiler'

export async function compileCode(code: any, fileName: any, isSFC: Boolean) {
  const { compiled, errors } = await compileSFC(fileName, code, {
    isSFC,
    inlineTemplate: false,
    extraExportConfig: { disableReplaceVUEExport: true },
  })
  if (compiled) {
    const file = new File(fileName, code, true)
    file.compiled.js = compiled
    return { errors, file }
  }

  return { errors, file: null }
}

export async function compileFile(store: Store): Promise<(string | Error)[]> {
  const script = store.files['Script.js'].code
  const template =
    store.files['Template.js'].code?.trim().replace(/;+$/, '') || 'null'
  const style = store.files['Style.css'].code
  const setup = store.files['Setup.js'].code
  const code = `<script setup lang="jsx">
/** @ts-ignore **/
${setup}
</script>
<script lang="jsx">
/** @ts-ignore **/
${script || ''}

/** @ts-ignore **/
export default {
  render($ctx, $cache, $props, $setup, $data, $options) {
    return (${template});
  }
};
</script>
<style scoped lang="scss">
${style || ''}
</style>`
  const { compiled, errors } = await compileSFC('test.vue', code, {
    isSFC: true,
    inlineTemplate: false,
    extraExportConfig: { disableReplaceVUEExport: true },
  })
  if (compiled) {
    store.files['Main.vue'].compiled.js = compiled
    store.files['Main.vue'].code = code
  }

  return errors
}
