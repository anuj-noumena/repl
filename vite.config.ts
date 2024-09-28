import { type Plugin, mergeConfig } from 'vite'
import dts from 'vite-plugin-dts'
import vuetify from 'vite-plugin-vuetify'
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
    // 1. MonacoEditor.css -> monaco-editor.css
    const outDir = path.resolve('dist')
    fs.renameSync(
      path.resolve(outDir, 'MonacoEditor.css'),
      path.resolve(outDir, 'monaco-editor.css'),
    )

    // 2. inject css imports to the files
    ;['vue-repl', 'monaco-editor'].forEach((file) => {
      const filePath = path.resolve(outDir, file + '.js')
      const content = fs.readFileSync(filePath, 'utf-8')
      fs.writeFileSync(filePath, `import './${file}.css'\n${content}`)
    })
  },
}

export default mergeConfig(base, {
  resolve: {
    alias: {
      '@vue/compiler-dom': '@vue/compiler-dom/dist/compiler-dom.cjs.js',
      '@vue/compiler-core': '@vue/compiler-core/dist/compiler-core.cjs.js',
    },
  },
  plugins: [
    vuetify({
      styles: { configFile: 'src/settings.scss' },
    }),
    dts({
      rollupTypes: true,
    }),
    genStub,
    patchCssFiles,
    //cssInjectedByJsPlugin(),
  ],
  optimizeDeps: {
    // avoid late discovered deps
    include: [
      'typescript',
      'monaco-editor-core/esm/vs/editor/editor.worker',
      'vue/server-renderer',
    ],
    exclude: ['vuetify', '@unimindsoftware/plugin-vue'],
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
        '@unimindsoftware/app-loader',
        'lodash-es',
        '@unimindsoftware/core',
        '@unimindsoftware/router',
        '@unimindsoftware/router/mock',
        '@vue/compiler-sfc',
        /vuetify\/.*/,
      ],
    },
  },
})
