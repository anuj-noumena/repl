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

const fileSelector = useTemplateRef('fileSelector')
function horizontalScroll(e: WheelEvent) {
  e.preventDefault()
  const el = fileSelector.value!
  const direction =
    Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY
  const distance = 30 * (direction > 0 ? 1 : -1)
  el.scrollTo({
    left: el.scrollLeft + distance,
  })
}
</script>

<template>
  <div
    ref="fileSelector"
    class="file-selector"
    :class="{ 'has-import-map': showImportMap }"
    @wheel="horizontalScroll"
  >
    <template v-for="(file) in files" :key="file">
      <div
        v-if="pending !== file"
        class="file"
        :class="{ active: store.activeFile.filename === file }"
        @click="store.setActive(file)"
      >
        <span class="label">{{ stripSrcPrefix(file) }}</span>
      </div>
    </template>

    <div class="import-map-wrapper">
      <div
        v-if="showTsConfig && store.files[tsconfigFile]"
        class="file"
        :class="{ active: store.activeFile.filename === tsconfigFile }"
        @click="store.setActive(tsconfigFile)"
      >
        <span class="label">tsconfig.json</span>
      </div>
      <div
        v-if="showImportMap"
        class="file"
        :class="{ active: store.activeFile.filename === importMapFile }"
        @click="store.setActive(importMapFile)"
      >
        <span class="label">Import Map</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-selector {
  display: flex;
  box-sizing: border-box;
  border-bottom: 1px solid var(--border);
  background-color: var(--bg);
  overflow-y: hidden;
  overflow-x: auto;
  white-space: nowrap;
  position: relative;
  height: var(--header-height);
}

.file-selector::-webkit-scrollbar {
  height: 1px;
}

.file-selector::-webkit-scrollbar-track {
  background-color: var(--border);
}

.file-selector::-webkit-scrollbar-thumb {
  background-color: var(--color-branding);
}

.file-selector.has-import-map .add {
  margin-right: 10px;
}

.file {
  position: relative;
  display: inline-block;
  font-size: 13px;
  font-family: var(--font-code);
  cursor: pointer;
  color: var(--text-light);
  box-sizing: border-box;
}
.file.active {
  color: var(--color-branding);
  border-bottom: 3px solid var(--color-branding);
  cursor: text;
}
.file span {
  display: inline-block;
  padding: 8px 10px 6px;
  line-height: 20px;
}
.file.pending span {
  min-width: 50px;
  min-height: 34px;
  padding-right: 32px;
  background-color: rgba(200, 200, 200, 0.2);
  color: transparent;
}
.file.pending input {
  position: absolute;
  inset: 8px 7px auto;
  font-size: 13px;
  font-family: var(--font-code);
  line-height: 20px;
  outline: none;
  border: none;
  padding: 0 3px;
  min-width: 1px;
  color: inherit;
  background-color: transparent;
}
.file .remove {
  display: inline-block;
  vertical-align: middle;
  line-height: 12px;
  cursor: pointer;
  padding-left: 0;
}
.add {
  font-size: 18px;
  font-family: var(--font-code);
  color: #999;
  vertical-align: middle;
  margin-left: 6px;
  position: relative;
  top: -1px;
}
.add:hover {
  color: var(--color-branding);
}
.icon {
  margin-top: -1px;
}
.import-map-wrapper {
  position: sticky;
  margin-left: auto;
  top: 0;
  right: 0;
  padding-left: 30px;
  background-color: var(--bg);
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 25%
  );
}
.dark .import-map-wrapper {
  background: linear-gradient(
    90deg,
    rgba(26, 26, 26, 0) 0%,
    rgba(26, 26, 26, 1) 25%
  );
}
</style>
