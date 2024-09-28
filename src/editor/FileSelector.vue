<script setup lang="ts">
import { injectKeyProps } from '../../src/types'
import { importMapFile, stripSrcPrefix, tsconfigFile } from '../store'
import { computed, inject, ref, useTemplateRef } from 'vue'

const { store, showTsConfig, showImportMap } = inject(injectKeyProps)!

/**
 * When `true`: indicates adding a new file
 * When `string`: indicates renaming a file, and holds the old filename in case
 * of cancel.
 */
const pending = ref<boolean | string>(false)
/**
 * Text shown in the input box when editing a file's name
 * This is a display name so it should always strip off the `src/` prefix.
 */
const files = computed(() =>
  Object.entries(store.value.files)
    .filter(
      ([name, file]) =>
        name !== importMapFile && name !== tsconfigFile && !file.hidden,
    )
    .map(([name]) => name),
)


const activeFile = computed({
  get: () => store.value.activeFile.filename,
  set: (val) => {
    if (!pending.value) store.value.setActive(val)
  },
})
</script>

<template>
  <v-tabs
    ref="fileSelector"
    v-model="activeFile"
    class="file-selector"
    :class="{ 'has-import-map': showImportMap }"
    color="primary"
    bg-color="background"
    density="comfortable"
    show-arrows
  >
    <v-tab
      v-for="(file, i) in files"
      :key="i"
      :value="file"
      class="file"
      size="small"
    >
      <span>{{ stripSrcPrefix(file).split('.').shift() }}</span>
    </v-tab>
    <v-tab
      v-if="showImportMap"
      class="file import-map"
      size="small"
      :value="importMapFile"
    >
      Import Map
    </v-tab>
  </v-tabs>
</template>

<style scoped>
.file.import-map {
  /*position: sticky;*/
  /*right: 0;*/
  margin-left: auto;
  background: rgb(var(--v-theme-background)) !important;
}
</style>
