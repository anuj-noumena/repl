// vite.config.ts
import { mergeConfig } from "file:///home/anuj/projects/UniMind/node_modules/.pnpm/vite@5.4.8_@types+node@22.7.5_sass@1.79.4_terser@5.34.1/node_modules/vite/dist/node/index.js";
import dts from "file:///home/anuj/projects/UniMind/node_modules/.pnpm/vite-plugin-dts@4.2.3_@types+node@22.7.5_rollup@4.24.0_typescript@5.6.2_vite@5.4.8_@types+nod_m7rdxrlubur5uje2hrm55fqkca/node_modules/vite-plugin-dts/dist/index.mjs";

// vite.preview.config.ts
import { defineConfig } from "file:///home/anuj/projects/UniMind/node_modules/.pnpm/vite@5.4.8_@types+node@22.7.5_sass@1.79.4_terser@5.34.1/node_modules/vite/dist/node/index.js";
import vue from "file:///home/anuj/projects/UniMind/node_modules/.pnpm/@vitejs+plugin-vue@5.1.4_vite@5.4.8_@types+node@22.7.5_sass@1.79.4_terser@5.34.1__vue@3.5.11_typescript@5.6.2_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import replace from "file:///home/anuj/projects/UniMind/node_modules/.pnpm/@rollup+plugin-replace@5.0.7_rollup@4.24.0/node_modules/@rollup/plugin-replace/dist/es/index.js";
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
  plugins: [
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
    ]
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
        "@volar/monaco",
        "vue",
        "vue/compiler-sfc",
        "@unimindsoftware/app-loader",
        "lodash-es",
        "@unimindsoftware/core",
        "@unimindsoftware/router",
        "@unimindsoftware/router/mock",
        /@vue\/.*/,
        /@unimindsoftware\/plugin-vue\/.*/
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidml0ZS5wcmV2aWV3LmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2FudWovcHJvamVjdHMvVW5pTWluZC9VbmlNaW5kVUlSZXBsXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9hbnVqL3Byb2plY3RzL1VuaU1pbmQvVW5pTWluZFVJUmVwbC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9hbnVqL3Byb2plY3RzL1VuaU1pbmQvVW5pTWluZFVJUmVwbC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IHR5cGUgUGx1Z2luLCBtZXJnZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcbmltcG9ydCBiYXNlIGZyb20gJy4vdml0ZS5wcmV2aWV3LmNvbmZpZydcbmltcG9ydCBmcyBmcm9tICdub2RlOmZzJ1xuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJ1xuXG5jb25zdCBnZW5TdHViOiBQbHVnaW4gPSB7XG4gIG5hbWU6ICdnZW4tc3R1YicsXG4gIGFwcGx5OiAnYnVpbGQnLFxuICBnZW5lcmF0ZUJ1bmRsZSgpIHtcbiAgICB0aGlzLmVtaXRGaWxlKHtcbiAgICAgIHR5cGU6ICdhc3NldCcsXG4gICAgICBmaWxlTmFtZTogJ3Nzci1zdHViLmpzJyxcbiAgICAgIHNvdXJjZTogYG1vZHVsZS5leHBvcnRzID0ge31gLFxuICAgIH0pXG4gIH0sXG59XG5cbi8qKlxuICogUGF0Y2ggZ2VuZXJhdGVkIGVudHJpZXMgYW5kIGltcG9ydCB0aGVpciBjb3JyZXNwb25kaW5nIENTUyBmaWxlcy5cbiAqIEFsc28gbm9ybWFsaXplIE1vbmFjb0VkaXRvci5jc3NcbiAqL1xuY29uc3QgcGF0Y2hDc3NGaWxlczogUGx1Z2luID0ge1xuICBuYW1lOiAncGF0Y2gtY3NzJyxcbiAgYXBwbHk6ICdidWlsZCcsXG4gIHdyaXRlQnVuZGxlKCkge1xuICAgIC8vIDEuIE1vbmFjb0VkaXRvci5jc3MgLT4gbW9uYWNvLWVkaXRvci5jc3NcbiAgICBjb25zdCBvdXREaXIgPSBwYXRoLnJlc29sdmUoJ2Rpc3QnKVxuICAgIGZzLnJlbmFtZVN5bmMoXG4gICAgICBwYXRoLnJlc29sdmUob3V0RGlyLCAnTW9uYWNvRWRpdG9yLmNzcycpLFxuICAgICAgcGF0aC5yZXNvbHZlKG91dERpciwgJ21vbmFjby1lZGl0b3IuY3NzJyksXG4gICAgKVxuXG4gICAgLy8gMi4gaW5qZWN0IGNzcyBpbXBvcnRzIHRvIHRoZSBmaWxlc1xuICAgIDtbJ3Z1ZS1yZXBsJywgJ21vbmFjby1lZGl0b3InXS5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGgucmVzb2x2ZShvdXREaXIsIGZpbGUgKyAnLmpzJylcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsICd1dGYtOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGZpbGVQYXRoLCBgaW1wb3J0ICcuLyR7ZmlsZX0uY3NzJ1xcbiR7Y29udGVudH1gKVxuICAgIH0pXG4gIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IG1lcmdlQ29uZmlnKGJhc2UsIHtcbiAgcGx1Z2luczogW1xuICAgIGR0cyh7XG4gICAgICByb2xsdXBUeXBlczogdHJ1ZSxcbiAgICB9KSxcbiAgICBnZW5TdHViLFxuICAgIHBhdGNoQ3NzRmlsZXMsXG4gIF0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIC8vIGF2b2lkIGxhdGUgZGlzY292ZXJlZCBkZXBzXG4gICAgaW5jbHVkZTogW1xuICAgICAgJ3R5cGVzY3JpcHQnLFxuICAgICAgJ21vbmFjby1lZGl0b3ItY29yZS9lc20vdnMvZWRpdG9yL2VkaXRvci53b3JrZXInLFxuICAgICAgJ3Z1ZS9zZXJ2ZXItcmVuZGVyZXInLFxuICAgIF0sXG4gIH0sXG4gIGJhc2U6ICcuLycsXG4gIGJ1aWxkOiB7XG4gICAgZW1wdHlPdXREaXI6IGZhbHNlLFxuICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgbWluaWZ5OiBmYWxzZSxcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiB7XG4gICAgICAgICd2dWUtcmVwbCc6ICcuL3NyYy9pbmRleC50cycsXG4gICAgICAgICdtb25hY28tZWRpdG9yJzogJy4vc3JjL2VkaXRvci9Nb25hY29FZGl0b3IudnVlJ1xuICAgICAgfSxcbiAgICAgIGZvcm1hdHM6IFsnZXMnXSxcbiAgICAgIGZpbGVOYW1lOiAoKSA9PiAnW25hbWVdLmpzJyxcbiAgICB9LFxuICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdjaHVua3MvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICB9LFxuICAgICAgZXh0ZXJuYWw6IFtcbiAgICAgICAgJ0B2b2xhci9tb25hY28nLFxuICAgICAgICAndnVlJyxcbiAgICAgICAgJ3Z1ZS9jb21waWxlci1zZmMnLFxuICAgICAgICAnQHVuaW1pbmRzb2Z0d2FyZS9hcHAtbG9hZGVyJyxcbiAgICAgICAgJ2xvZGFzaC1lcycsXG4gICAgICAgICdAdW5pbWluZHNvZnR3YXJlL2NvcmUnLFxuICAgICAgICAnQHVuaW1pbmRzb2Z0d2FyZS9yb3V0ZXInLFxuICAgICAgICAnQHVuaW1pbmRzb2Z0d2FyZS9yb3V0ZXIvbW9jaycsXG4gICAgICAgIC9AdnVlXFwvLiovLFxuICAgICAgICAvQHVuaW1pbmRzb2Z0d2FyZVxcL3BsdWdpbi12dWVcXC8uKi9cbiAgICAgIF0sXG4gICAgfSxcbiAgfSxcbn0pXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2FudWovcHJvamVjdHMvVW5pTWluZC9VbmlNaW5kVUlSZXBsXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9hbnVqL3Byb2plY3RzL1VuaU1pbmQvVW5pTWluZFVJUmVwbC92aXRlLnByZXZpZXcuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2FudWovcHJvamVjdHMvVW5pTWluZC9VbmlNaW5kVUlSZXBsL3ZpdGUucHJldmlldy5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgcmVwbGFjZSBmcm9tICdAcm9sbHVwL3BsdWdpbi1yZXBsYWNlJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbdnVlKCldLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAdnVlL2NvbXBpbGVyLWRvbSc6ICdAdnVlL2NvbXBpbGVyLWRvbS9kaXN0L2NvbXBpbGVyLWRvbS5janMuanMnLFxuICAgICAgJ0B2dWUvY29tcGlsZXItY29yZSc6ICdAdnVlL2NvbXBpbGVyLWNvcmUvZGlzdC9jb21waWxlci1jb3JlLmNqcy5qcycsXG4gICAgICAnQHVuaW1pbmRzb2Z0d2FyZS9wbHVnaW4tdnVlL2NvbXBpbGVyJzogJy4vbm9kZV9tb2R1bGVzL0B1bmltaW5kc29mdHdhcmUvcGx1Z2luLXZ1ZS9kaXN0L2NvbXBpbGVyLm1qcycsXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBjb21tb25qc09wdGlvbnM6IHtcbiAgICAgIGlnbm9yZTogWyd0eXBlc2NyaXB0J10sXG4gICAgfSxcbiAgfSxcbiAgd29ya2VyOiB7XG4gICAgZm9ybWF0OiAnZXMnLFxuICAgIHBsdWdpbnM6ICgpID0+IFtcbiAgICAgIHJlcGxhY2Uoe1xuICAgICAgICBwcmV2ZW50QXNzaWdubWVudDogdHJ1ZSxcbiAgICAgICAgdmFsdWVzOiB7XG4gICAgICAgICAgJ3Byb2Nlc3MuZW52Lk5PREVfRU5WJzogSlNPTi5zdHJpbmdpZnkoJ3Byb2R1Y3Rpb24nKSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIF0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2UyxTQUFzQixtQkFBbUI7QUFDdFYsT0FBTyxTQUFTOzs7QUNENlMsU0FBUyxvQkFBb0I7QUFDMVYsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sYUFBYTtBQUVwQixJQUFPLDhCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsSUFBSSxDQUFDO0FBQUEsRUFDZixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxxQkFBcUI7QUFBQSxNQUNyQixzQkFBc0I7QUFBQSxNQUN0Qix3Q0FBd0M7QUFBQSxJQUMxQztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGlCQUFpQjtBQUFBLE1BQ2YsUUFBUSxDQUFDLFlBQVk7QUFBQSxJQUN2QjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLFFBQVE7QUFBQSxJQUNSLFNBQVMsTUFBTTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sbUJBQW1CO0FBQUEsUUFDbkIsUUFBUTtBQUFBLFVBQ04sd0JBQXdCLEtBQUssVUFBVSxZQUFZO0FBQUEsUUFDckQ7QUFBQSxNQUNGLENBQUM7QUFBQSxJQUNIO0FBQUEsRUFDRjtBQUNGLENBQUM7OztBRDFCRCxPQUFPLFFBQVE7QUFDZixPQUFPLFVBQVU7QUFFakIsSUFBTSxVQUFrQjtBQUFBLEVBQ3RCLE1BQU07QUFBQSxFQUNOLE9BQU87QUFBQSxFQUNQLGlCQUFpQjtBQUNmLFNBQUssU0FBUztBQUFBLE1BQ1osTUFBTTtBQUFBLE1BQ04sVUFBVTtBQUFBLE1BQ1YsUUFBUTtBQUFBLElBQ1YsQ0FBQztBQUFBLEVBQ0g7QUFDRjtBQU1BLElBQU0sZ0JBQXdCO0FBQUEsRUFDNUIsTUFBTTtBQUFBLEVBQ04sT0FBTztBQUFBLEVBQ1AsY0FBYztBQUVaLFVBQU0sU0FBUyxLQUFLLFFBQVEsTUFBTTtBQUNsQyxPQUFHO0FBQUEsTUFDRCxLQUFLLFFBQVEsUUFBUSxrQkFBa0I7QUFBQSxNQUN2QyxLQUFLLFFBQVEsUUFBUSxtQkFBbUI7QUFBQSxJQUMxQztBQUdDLEtBQUMsWUFBWSxlQUFlLEVBQUUsUUFBUSxDQUFDLFNBQVM7QUFDL0MsWUFBTSxXQUFXLEtBQUssUUFBUSxRQUFRLE9BQU8sS0FBSztBQUNsRCxZQUFNLFVBQVUsR0FBRyxhQUFhLFVBQVUsT0FBTztBQUNqRCxTQUFHLGNBQWMsVUFBVSxhQUFhLElBQUk7QUFBQSxFQUFVLE9BQU8sRUFBRTtBQUFBLElBQ2pFLENBQUM7QUFBQSxFQUNIO0FBQ0Y7QUFFQSxJQUFPLHNCQUFRLFlBQVksNkJBQU07QUFBQSxFQUMvQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsTUFDRixhQUFhO0FBQUEsSUFDZixDQUFDO0FBQUEsSUFDRDtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUE7QUFBQSxJQUVaLFNBQVM7QUFBQSxNQUNQO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTTtBQUFBLEVBQ04sT0FBTztBQUFBLElBQ0wsYUFBYTtBQUFBLElBQ2IsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLElBQ1IsS0FBSztBQUFBLE1BQ0gsT0FBTztBQUFBLFFBQ0wsWUFBWTtBQUFBLFFBQ1osaUJBQWlCO0FBQUEsTUFDbkI7QUFBQSxNQUNBLFNBQVMsQ0FBQyxJQUFJO0FBQUEsTUFDZCxVQUFVLE1BQU07QUFBQSxJQUNsQjtBQUFBLElBQ0EsY0FBYztBQUFBLElBQ2QsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxNQUNBLFVBQVU7QUFBQSxRQUNSO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
