import { type Plugin, mergeConfig } from 'vite'
import dts from 'vite-plugin-dts'
import base from './vite.preview.config'
import fs from 'node:fs'
import path from 'node:path'

const genStub: Plugin = {
  name: 'gen-stub',
  apply: 'build',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'ssr-stub.js',
      source: `module.exports = {}`,
    })
  },
}

/**
 * Patch generated entries and import their corresponding CSS files.
 * Also normalize MonacoEditor.css
 */
const patchCssFiles: Plugin = {
  name: 'patch-css',
  apply: 'build',
  writeBundle() {
    //  inject css imports to the files
    const outDir = path.resolve('dist')
    ;['vue-repl', 'monaco-editor'].forEach((file) => {
      const filePath = path.resolve(outDir, file + '.js')
      const content = fs.readFileSync(filePath, 'utf-8')
      fs.writeFileSync(filePath, `import './${file}.css'\n${content}`)
    })
  },
}

export default mergeConfig(base, {
  plugins: [
    // dts({
    //   rollupTypes: true,
    // }),
    genStub,
    patchCssFiles,
  ],
  optimizeDeps: {
    // avoid late discovered deps
    include: [
      'typescript',
      'monaco-editor-core/esm/vs/editor/editor.worker',
      'vue/server-renderer',
    ],
  },
  base: './',
  build: {
    emptyOutDir: false,
    target: 'esnext',
    minify: false,
    lib: {
      entry: {
        'vue-repl': './src/index.ts',
        'monaco-editor': './src/editor/MonacoEditor.vue',
      },
      formats: ['es'],
      fileName: () => '[name].js',
    },
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
      external: [
        'vue',
        /vue\/.*/,
        /@vue\/.*/,
        '@unimindsoftware/plugin-vue',
        /@unimindsoftware\/.*/,
        /@babel\/.*/,
        'lodash-es',
        /'lodash-es'\/.*/,
        'vuetify',
        /vuetify\/.*/,
        '@vue/babel-plugin-jsx',
        'sass',
        '@babel/standalone',
        'crypto-hash',
        '@babel/types',
        '@babel/helper-module-imports',
        "@vueuse/core",
      ],
    },
  },
})
