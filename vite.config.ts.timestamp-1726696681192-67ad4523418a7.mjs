// vite.config.ts
import { mergeConfig } from "file:///home/anuj/projects/UniMind/UniMindUIRepl/node_modules/.pnpm/vite@5.4.5_@types+node@22.5.4_sass@1.78.0/node_modules/vite/dist/node/index.js";
import dts from "file:///home/anuj/projects/UniMind/UniMindUIRepl/node_modules/.pnpm/vite-plugin-dts@4.2.1_@types+node@22.5.4_rollup@4.21.2_typescript@5.6.2_vite@5.4.5_@types+node@22.5.4_sass@1.78.0_/node_modules/vite-plugin-dts/dist/index.mjs";
import vuetify from "file:///home/anuj/projects/UniMind/UniMindUIRepl/node_modules/.pnpm/vite-plugin-vuetify@2.0.4_vite@5.4.5_@types+node@22.5.4_sass@1.78.0__vue@3.5.6_typescript@5.6.2__vuetify@3.7.1/node_modules/vite-plugin-vuetify/dist/index.mjs";

// vite.preview.config.ts
import { defineConfig } from "file:///home/anuj/projects/UniMind/UniMindUIRepl/node_modules/.pnpm/vite@5.4.5_@types+node@22.5.4_sass@1.78.0/node_modules/vite/dist/node/index.js";
import vue from "file:///home/anuj/projects/UniMind/UniMindUIRepl/node_modules/.pnpm/@vitejs+plugin-vue@5.1.3_vite@5.4.5_@types+node@22.5.4_sass@1.78.0__vue@3.5.6_typescript@5.6.2_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import replace from "file:///home/anuj/projects/UniMind/UniMindUIRepl/node_modules/.pnpm/@rollup+plugin-replace@5.0.7_rollup@4.21.2/node_modules/@rollup/plugin-replace/dist/es/index.js";
var vite_preview_config_default = defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@vue/compiler-dom": "@vue/compiler-dom/dist/compiler-dom.cjs.js",
      "@vue/compiler-core": "@vue/compiler-core/dist/compiler-core.cjs.js",
      "@unimindsoftware/plugin-vue/compiler": "./node_modules/@unimindsoftware/plugin-vue/dist/compiler.mjs"
    }
  },
  build: {
    commonjsOptions: {
      ignore: ["typescript"]
    }
  },
  worker: {
    format: "es",
    plugins: () => [
      replace({
        preventAssignment: true,
        values: {
          "process.env.NODE_ENV": JSON.stringify("production")
        }
      })
    ]
  }
});

// vite.config.ts
import fs from "node:fs";
import path from "node:path";
var genStub = {
  name: "gen-stub",
  apply: "build",
  generateBundle() {
    this.emitFile({
      type: "asset",
      fileName: "ssr-stub.js",
      source: `module.exports = {}`
    });
  }
};
var patchCssFiles = {
  name: "patch-css",
  apply: "build",
  writeBundle() {
    const outDir = path.resolve("dist");
    fs.renameSync(
      path.resolve(outDir, "MonacoEditor.css"),
      path.resolve(outDir, "monaco-editor.css")
    );
    ["vue-repl", "monaco-editor", "codemirror-editor"].forEach((file) => {
      const filePath = path.resolve(outDir, file + ".js");
      const content = fs.readFileSync(filePath, "utf-8");
      fs.writeFileSync(filePath, `import './${file}.css'
${content}`);
    });
  }
};
var vite_config_default = mergeConfig(vite_preview_config_default, {
  resolve: {
    alias: {
      "@vue/compiler-dom": "@vue/compiler-dom/dist/compiler-dom.cjs.js",
      "@vue/compiler-core": "@vue/compiler-core/dist/compiler-core.cjs.js"
    }
  },
  plugins: [
    vuetify({
      styles: { configFile: "src/settings.scss" }
    }),
    dts({
      rollupTypes: true
    }),
    genStub,
    patchCssFiles
  ],
  optimizeDeps: {
    // avoid late discovered deps
    include: [
      "typescript",
      "monaco-editor-core/esm/vs/editor/editor.worker",
      "vue/server-renderer"
    ],
    exclude: ["vuetify", "@unimindsoftware/plugin-vue"]
  },
  base: "./",
  build: {
    target: "esnext",
    minify: false,
    lib: {
      entry: {
        "vue-repl": "./src/index.ts",
        "monaco-editor": "./src/editor/MonacoEditor.vue",
        "codemirror-editor": "./src/editor/CodeMirrorEditor.vue"
      },
      formats: ["es"],
      fileName: () => "[name].js"
    },
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        chunkFileNames: "chunks/[name]-[hash].js"
      },
      external: [
        "vue",
        "vue/compiler-sfc",
        "@babel/types",
        "@babel/standalone",
        "@vue/babel-plugin-jsx",
        "@vue/compiler-sfc",
        "vite-plugin-eslint",
        "crypto-hash",
        "@unimindsoftware/plugin-vue",
        "@unimindsoftware/plugin-vue/compiler"
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidml0ZS5wcmV2aWV3LmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2FudWovcHJvamVjdHMvVW5pTWluZC9VbmlNaW5kVUlSZXBsXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9hbnVqL3Byb2plY3RzL1VuaU1pbmQvVW5pTWluZFVJUmVwbC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9hbnVqL3Byb2plY3RzL1VuaU1pbmQvVW5pTWluZFVJUmVwbC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IHR5cGUgUGx1Z2luLCBtZXJnZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcbmltcG9ydCB2dWV0aWZ5IGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZXRpZnknXG5pbXBvcnQgYmFzZSBmcm9tICcuL3ZpdGUucHJldmlldy5jb25maWcnXG5pbXBvcnQgZnMgZnJvbSAnbm9kZTpmcydcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCdcblxuY29uc3QgZ2VuU3R1YjogUGx1Z2luID0ge1xuICBuYW1lOiAnZ2VuLXN0dWInLFxuICBhcHBseTogJ2J1aWxkJyxcbiAgZ2VuZXJhdGVCdW5kbGUoKSB7XG4gICAgdGhpcy5lbWl0RmlsZSh7XG4gICAgICB0eXBlOiAnYXNzZXQnLFxuICAgICAgZmlsZU5hbWU6ICdzc3Itc3R1Yi5qcycsXG4gICAgICBzb3VyY2U6IGBtb2R1bGUuZXhwb3J0cyA9IHt9YCxcbiAgICB9KVxuICB9LFxufVxuXG4vKipcbiAqIFBhdGNoIGdlbmVyYXRlZCBlbnRyaWVzIGFuZCBpbXBvcnQgdGhlaXIgY29ycmVzcG9uZGluZyBDU1MgZmlsZXMuXG4gKiBBbHNvIG5vcm1hbGl6ZSBNb25hY29FZGl0b3IuY3NzXG4gKi9cbmNvbnN0IHBhdGNoQ3NzRmlsZXM6IFBsdWdpbiA9IHtcbiAgbmFtZTogJ3BhdGNoLWNzcycsXG4gIGFwcGx5OiAnYnVpbGQnLFxuICB3cml0ZUJ1bmRsZSgpIHtcbiAgICAvLyAxLiBNb25hY29FZGl0b3IuY3NzIC0+IG1vbmFjby1lZGl0b3IuY3NzXG4gICAgY29uc3Qgb3V0RGlyID0gcGF0aC5yZXNvbHZlKCdkaXN0JylcbiAgICBmcy5yZW5hbWVTeW5jKFxuICAgICAgcGF0aC5yZXNvbHZlKG91dERpciwgJ01vbmFjb0VkaXRvci5jc3MnKSxcbiAgICAgIHBhdGgucmVzb2x2ZShvdXREaXIsICdtb25hY28tZWRpdG9yLmNzcycpLFxuICAgIClcblxuICAgIC8vIDIuIGluamVjdCBjc3MgaW1wb3J0cyB0byB0aGUgZmlsZXNcbiAgICA7Wyd2dWUtcmVwbCcsICdtb25hY28tZWRpdG9yJywgJ2NvZGVtaXJyb3ItZWRpdG9yJ10uZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLnJlc29sdmUob3V0RGlyLCBmaWxlICsgJy5qcycpXG4gICAgICBjb25zdCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCAndXRmLTgnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhmaWxlUGF0aCwgYGltcG9ydCAnLi8ke2ZpbGV9LmNzcydcXG4ke2NvbnRlbnR9YClcbiAgICB9KVxuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBtZXJnZUNvbmZpZyhiYXNlLCB7XG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0B2dWUvY29tcGlsZXItZG9tJzogJ0B2dWUvY29tcGlsZXItZG9tL2Rpc3QvY29tcGlsZXItZG9tLmNqcy5qcycsXG4gICAgICAnQHZ1ZS9jb21waWxlci1jb3JlJzogJ0B2dWUvY29tcGlsZXItY29yZS9kaXN0L2NvbXBpbGVyLWNvcmUuY2pzLmpzJyxcbiAgICAgIFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICB2dWV0aWZ5KHtcbiAgICAgIHN0eWxlczogeyBjb25maWdGaWxlOiAnc3JjL3NldHRpbmdzLnNjc3MnIH0sXG4gICAgfSksXG4gICAgZHRzKHtcbiAgICAgIHJvbGx1cFR5cGVzOiB0cnVlLFxuICAgIH0pLFxuICAgIGdlblN0dWIsXG4gICAgcGF0Y2hDc3NGaWxlcyxcbiAgXSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgLy8gYXZvaWQgbGF0ZSBkaXNjb3ZlcmVkIGRlcHNcbiAgICBpbmNsdWRlOiBbXG4gICAgICAndHlwZXNjcmlwdCcsXG4gICAgICAnbW9uYWNvLWVkaXRvci1jb3JlL2VzbS92cy9lZGl0b3IvZWRpdG9yLndvcmtlcicsXG4gICAgICAndnVlL3NlcnZlci1yZW5kZXJlcicsXG4gICAgXSxcbiAgICBleGNsdWRlOiBbJ3Z1ZXRpZnknLCAnQHVuaW1pbmRzb2Z0d2FyZS9wbHVnaW4tdnVlJ10sXG4gIH0sXG4gIGJhc2U6ICcuLycsXG4gIGJ1aWxkOiB7XG4gICAgdGFyZ2V0OiAnZXNuZXh0JyxcbiAgICBtaW5pZnk6IGZhbHNlLFxuICAgIGxpYjoge1xuICAgICAgZW50cnk6IHtcbiAgICAgICAgJ3Z1ZS1yZXBsJzogJy4vc3JjL2luZGV4LnRzJyxcbiAgICAgICAgJ21vbmFjby1lZGl0b3InOiAnLi9zcmMvZWRpdG9yL01vbmFjb0VkaXRvci52dWUnLFxuICAgICAgICAnY29kZW1pcnJvci1lZGl0b3InOiAnLi9zcmMvZWRpdG9yL0NvZGVNaXJyb3JFZGl0b3IudnVlJyxcbiAgICAgIH0sXG4gICAgICBmb3JtYXRzOiBbJ2VzJ10sXG4gICAgICBmaWxlTmFtZTogKCkgPT4gJ1tuYW1lXS5qcycsXG4gICAgfSxcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnY2h1bmtzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgfSxcbiAgICAgIGV4dGVybmFsOiBbXG4gICAgICAgICd2dWUnLFxuICAgICAgICAndnVlL2NvbXBpbGVyLXNmYycsXG4gICAgICAgICdAYmFiZWwvdHlwZXMnLFxuICAgICAgICAnQGJhYmVsL3N0YW5kYWxvbmUnLFxuICAgICAgICAnQHZ1ZS9iYWJlbC1wbHVnaW4tanN4JyxcbiAgICAgICAgJ0B2dWUvY29tcGlsZXItc2ZjJyxcbiAgICAgICAgJ3ZpdGUtcGx1Z2luLWVzbGludCcsXG4gICAgICAgICdjcnlwdG8taGFzaCcsXG4gICAgICAgICdAdW5pbWluZHNvZnR3YXJlL3BsdWdpbi12dWUnLFxuICAgICAgICAnQHVuaW1pbmRzb2Z0d2FyZS9wbHVnaW4tdnVlL2NvbXBpbGVyJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSxcbn0pXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2FudWovcHJvamVjdHMvVW5pTWluZC9VbmlNaW5kVUlSZXBsXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9hbnVqL3Byb2plY3RzL1VuaU1pbmQvVW5pTWluZFVJUmVwbC92aXRlLnByZXZpZXcuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2FudWovcHJvamVjdHMvVW5pTWluZC9VbmlNaW5kVUlSZXBsL3ZpdGUucHJldmlldy5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgcmVwbGFjZSBmcm9tICdAcm9sbHVwL3BsdWdpbi1yZXBsYWNlJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbdnVlKCldLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAdnVlL2NvbXBpbGVyLWRvbSc6ICdAdnVlL2NvbXBpbGVyLWRvbS9kaXN0L2NvbXBpbGVyLWRvbS5janMuanMnLFxuICAgICAgJ0B2dWUvY29tcGlsZXItY29yZSc6ICdAdnVlL2NvbXBpbGVyLWNvcmUvZGlzdC9jb21waWxlci1jb3JlLmNqcy5qcycsXG4gICAgICAnQHVuaW1pbmRzb2Z0d2FyZS9wbHVnaW4tdnVlL2NvbXBpbGVyJzogJy4vbm9kZV9tb2R1bGVzL0B1bmltaW5kc29mdHdhcmUvcGx1Z2luLXZ1ZS9kaXN0L2NvbXBpbGVyLm1qcycsXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBjb21tb25qc09wdGlvbnM6IHtcbiAgICAgIGlnbm9yZTogWyd0eXBlc2NyaXB0J10sXG4gICAgfSxcbiAgfSxcbiAgd29ya2VyOiB7XG4gICAgZm9ybWF0OiAnZXMnLFxuICAgIHBsdWdpbnM6ICgpID0+IFtcbiAgICAgIHJlcGxhY2Uoe1xuICAgICAgICBwcmV2ZW50QXNzaWdubWVudDogdHJ1ZSxcbiAgICAgICAgdmFsdWVzOiB7XG4gICAgICAgICAgJ3Byb2Nlc3MuZW52Lk5PREVfRU5WJzogSlNPTi5zdHJpbmdpZnkoJ3Byb2R1Y3Rpb24nKSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIF0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2UyxTQUFzQixtQkFBbUI7QUFDdFYsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sYUFBYTs7O0FDRnlTLFNBQVMsb0JBQW9CO0FBQzFWLE9BQU8sU0FBUztBQUNoQixPQUFPLGFBQWE7QUFFcEIsSUFBTyw4QkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLElBQUksQ0FBQztBQUFBLEVBQ2YsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wscUJBQXFCO0FBQUEsTUFDckIsc0JBQXNCO0FBQUEsTUFDdEIsd0NBQXdDO0FBQUEsSUFDMUM7QUFBQSxFQUNGO0FBQUEsRUFD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
