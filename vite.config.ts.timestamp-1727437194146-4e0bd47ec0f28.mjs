// vite.config.ts
import { mergeConfig } from "file:///home/anuj/projects/UniMind/node_modules/.pnpm/vite@5.4.8_@types+node@22.7.3_sass@1.79.3_terser@5.34.0/node_modules/vite/dist/node/index.js";
import dts from "file:///home/anuj/projects/UniMind/node_modules/.pnpm/vite-plugin-dts@4.2.2_@types+node@22.7.3_rollup@4.22.4_typescript@5.6.2_vite@5.4.8_@types+nod_aji2ie46k4o4tyrzwtqjixlj7m/node_modules/vite-plugin-dts/dist/index.mjs";
import vuetify from "file:///home/anuj/projects/UniMind/node_modules/.pnpm/vite-plugin-vuetify@2.0.4_vite@5.4.8_@types+node@22.7.3_sass@1.79.3_terser@5.34.0__vue@3.5.9__wvrxghasnybsa6p3lwjs76365u/node_modules/vite-plugin-vuetify/dist/index.mjs";

// vite.preview.config.ts
import { defineConfig } from "file:///home/anuj/projects/UniMind/node_modules/.pnpm/vite@5.4.8_@types+node@22.7.3_sass@1.79.3_terser@5.34.0/node_modules/vite/dist/node/index.js";
import vue from "file:///home/anuj/projects/UniMind/node_modules/.pnpm/@vitejs+plugin-vue@5.1.4_vite@5.4.8_@types+node@22.7.3_sass@1.79.3_terser@5.34.0__vue@3.5.9_typescript@5.6.2_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import replace from "file:///home/anuj/projects/UniMind/node_modules/.pnpm/@rollup+plugin-replace@5.0.7_rollup@4.22.4/node_modules/@rollup/plugin-replace/dist/es/index.js";
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
    ["vue-repl", "monaco-editor"].forEach((file) => {
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
    //cssInjectedByJsPlugin(),
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
    emptyOutDir: false,
    target: "esnext",
    minify: false,
    lib: {
      entry: {
        "vue-repl": "./src/index.ts",
        "monaco-editor": "./src/editor/MonacoEditor.vue"
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
        "@unimindsoftware/app-loader",
        "lodash-es",
        "@unimindsoftware/core",
        "@unimindsoftware/router",
        "@unimindsoftware/router/mock",
        "@vue/compiler-sfc",
        /vuetify\/.*/
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidml0ZS5wcmV2aWV3LmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2FudWovcHJvamVjdHMvVW5pTWluZC9VbmlNaW5kVUlSZXBsXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9hbnVqL3Byb2plY3RzL1VuaU1pbmQvVW5pTWluZFVJUmVwbC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9hbnVqL3Byb2plY3RzL1VuaU1pbmQvVW5pTWluZFVJUmVwbC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IHR5cGUgUGx1Z2luLCBtZXJnZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcbmltcG9ydCB2dWV0aWZ5IGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZXRpZnknXG5pbXBvcnQgYmFzZSBmcm9tICcuL3ZpdGUucHJldmlldy5jb25maWcnXG5pbXBvcnQgZnMgZnJvbSAnbm9kZTpmcydcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCdcblxuY29uc3QgZ2VuU3R1YjogUGx1Z2luID0ge1xuICBuYW1lOiAnZ2VuLXN0dWInLFxuICBhcHBseTogJ2J1aWxkJyxcbiAgZ2VuZXJhdGVCdW5kbGUoKSB7XG4gICAgdGhpcy5lbWl0RmlsZSh7XG4gICAgICB0eXBlOiAnYXNzZXQnLFxuICAgICAgZmlsZU5hbWU6ICdzc3Itc3R1Yi5qcycsXG4gICAgICBzb3VyY2U6IGBtb2R1bGUuZXhwb3J0cyA9IHt9YCxcbiAgICB9KVxuICB9LFxufVxuXG4vKipcbiAqIFBhdGNoIGdlbmVyYXRlZCBlbnRyaWVzIGFuZCBpbXBvcnQgdGhlaXIgY29ycmVzcG9uZGluZyBDU1MgZmlsZXMuXG4gKiBBbHNvIG5vcm1hbGl6ZSBNb25hY29FZGl0b3IuY3NzXG4gKi9cbmNvbnN0IHBhdGNoQ3NzRmlsZXM6IFBsdWdpbiA9IHtcbiAgbmFtZTogJ3BhdGNoLWNzcycsXG4gIGFwcGx5OiAnYnVpbGQnLFxuICB3cml0ZUJ1bmRsZSgpIHtcbiAgICAvLyAxLiBNb25hY29FZGl0b3IuY3NzIC0+IG1vbmFjby1lZGl0b3IuY3NzXG4gICAgY29uc3Qgb3V0RGlyID0gcGF0aC5yZXNvbHZlKCdkaXN0JylcbiAgICBmcy5yZW5hbWVTeW5jKFxuICAgICAgcGF0aC5yZXNvbHZlKG91dERpciwgJ01vbmFjb0VkaXRvci5jc3MnKSxcbiAgICAgIHBhdGgucmVzb2x2ZShvdXREaXIsICdtb25hY28tZWRpdG9yLmNzcycpLFxuICAgIClcblxuICAgIC8vIDIuIGluamVjdCBjc3MgaW1wb3J0cyB0byB0aGUgZmlsZXNcbiAgICA7Wyd2dWUtcmVwbCcsICdtb25hY28tZWRpdG9yJ10uZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLnJlc29sdmUob3V0RGlyLCBmaWxlICsgJy5qcycpXG4gICAgICBjb25zdCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCAndXRmLTgnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhmaWxlUGF0aCwgYGltcG9ydCAnLi8ke2ZpbGV9LmNzcydcXG4ke2NvbnRlbnR9YClcbiAgICB9KVxuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBtZXJnZUNvbmZpZyhiYXNlLCB7XG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0B2dWUvY29tcGlsZXItZG9tJzogJ0B2dWUvY29tcGlsZXItZG9tL2Rpc3QvY29tcGlsZXItZG9tLmNqcy5qcycsXG4gICAgICAnQHZ1ZS9jb21waWxlci1jb3JlJzogJ0B2dWUvY29tcGlsZXItY29yZS9kaXN0L2NvbXBpbGVyLWNvcmUuY2pzLmpzJyxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgdnVldGlmeSh7XG4gICAgICBzdHlsZXM6IHsgY29uZmlnRmlsZTogJ3NyYy9zZXR0aW5ncy5zY3NzJyB9LFxuICAgIH0pLFxuICAgIGR0cyh7XG4gICAgICByb2xsdXBUeXBlczogdHJ1ZSxcbiAgICB9KSxcbiAgICBnZW5TdHViLFxuICAgIHBhdGNoQ3NzRmlsZXMsXG4gICAgLy9jc3NJbmplY3RlZEJ5SnNQbHVnaW4oKSxcbiAgXSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgLy8gYXZvaWQgbGF0ZSBkaXNjb3ZlcmVkIGRlcHNcbiAgICBpbmNsdWRlOiBbXG4gICAgICAndHlwZXNjcmlwdCcsXG4gICAgICAnbW9uYWNvLWVkaXRvci1jb3JlL2VzbS92cy9lZGl0b3IvZWRpdG9yLndvcmtlcicsXG4gICAgICAndnVlL3NlcnZlci1yZW5kZXJlcicsXG4gICAgXSxcbiAgICBleGNsdWRlOiBbJ3Z1ZXRpZnknLCAnQHVuaW1pbmRzb2Z0d2FyZS9wbHVnaW4tdnVlJ10sXG4gIH0sXG4gIGJhc2U6ICcuLycsXG4gIGJ1aWxkOiB7XG4gICAgZW1wdHlPdXREaXI6IGZhbHNlLFxuICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgbWluaWZ5OiBmYWxzZSxcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiB7XG4gICAgICAgICd2dWUtcmVwbCc6ICcuL3NyYy9pbmRleC50cycsXG4gICAgICAgICdtb25hY28tZWRpdG9yJzogJy4vc3JjL2VkaXRvci9Nb25hY29FZGl0b3IudnVlJyxcbiAgICAgIH0sXG4gICAgICBmb3JtYXRzOiBbJ2VzJ10sXG4gICAgICBmaWxlTmFtZTogKCkgPT4gJ1tuYW1lXS5qcycsXG4gICAgfSxcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnY2h1bmtzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgfSxcbiAgICAgIGV4dGVybmFsOiBbXG4gICAgICAgICd2dWUnLFxuICAgICAgICAnQHVuaW1pbmRzb2Z0d2FyZS9hcHAtbG9hZGVyJyxcbiAgICAgICAgJ2xvZGFzaC1lcycsXG4gICAgICAgICdAdW5pbWluZHNvZnR3YXJlL2NvcmUnLFxuICAgICAgICAnQHVuaW1pbmRzb2Z0d2FyZS9yb3V0ZXInLFxuICAgICAgICAnQHVuaW1pbmRzb2Z0d2FyZS9yb3V0ZXIvbW9jaycsXG4gICAgICAgICdAdnVlL2NvbXBpbGVyLXNmYycsXG4gICAgICAgIC92dWV0aWZ5XFwvLiovLFxuICAgICAgXSxcbiAgICB9LFxuICB9LFxufSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvYW51ai9wcm9qZWN0cy9VbmlNaW5kL1VuaU1pbmRVSVJlcGxcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2FudWovcHJvamVjdHMvVW5pTWluZC9VbmlNaW5kVUlSZXBsL3ZpdGUucHJldmlldy5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvYW51ai9wcm9qZWN0cy9VbmlNaW5kL1VuaU1pbmRVSVJlcGwvdml0ZS5wcmV2aWV3LmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCByZXBsYWNlIGZyb20gJ0Byb2xsdXAvcGx1Z2luLXJlcGxhY2UnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFt2dWUoKV0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0B2dWUvY29tcGlsZXItZG9tJzogJ0B2dWUvY29tcGlsZXItZG9tL2Rpc3QvY29tcGlsZXItZG9tLmNqcy5qcycsXG4gICAgICAnQHZ1ZS9jb21waWxlci1jb3JlJzogJ0B2dWUvY29tcGlsZXItY29yZS9kaXN0L2NvbXBpbGVyLWNvcmUuY2pzLmpzJyxcbiAgICAgICdAdW5pbWluZHNvZnR3YXJlL3BsdWdpbi12dWUvY29tcGlsZXInOiAnLi9ub2RlX21vZHVsZXMvQHVuaW1pbmRzb2Z0d2FyZS9wbHVnaW4tdnVlL2Rpc3QvY29tcGlsZXIubWpzJyxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIGNvbW1vbmpzT3B0aW9uczoge1xuICAgICAgaWdub3JlOiBbJ3R5cGVzY3JpcHQnXSxcbiAgICB9LFxuICB9LFxuICB3b3JrZXI6IHtcbiAgICBmb3JtYXQ6ICdlcycsXG4gICAgcGx1Z2luczogKCkgPT4gW1xuICAgICAgcmVwbGFjZSh7XG4gICAgICAgIHByZXZlbnRBc3NpZ25tZW50OiB0cnVlLFxuICAgICAgICB2YWx1ZXM6IHtcbiAgICAgICAgICAncHJvY2Vzcy5lbnYuTk9ERV9FTlYnOiBKU09OLnN0cmluZ2lmeSgncHJvZHVjdGlvbicpLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgXSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZTLFNBQXNCLG1CQUFtQjtBQUN0VixPQUFPLFNBQVM7QUFDaEIsT0FBTyxhQUFhOzs7QUNGeVMsU0FBUyxvQkFBb0I7QUFDMVYsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sYUFBYTtBQUVwQixJQUFPLDhCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsSUFBSSxDQUFDO0FBQUEsRUFDZixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxxQkFBcUI7QUFBQSxNQUNyQixzQkFBc0I7QUFBQSxNQUN0Qix3Q0FBd0M7QUFBQSxJQUMxQztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGlCQUFpQjtBQUFBLE1BQ2YsUUFBUSxDQUFDLFlBQVk7QUFBQSxJQUN2QjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLFFBQVE7QUFB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
