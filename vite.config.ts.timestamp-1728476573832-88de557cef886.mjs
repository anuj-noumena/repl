// vite.config.ts
import { mergeConfig } from "file:///home/anuj/projects/UniMind/node_modules/.pnpm/vite@5.4.8_@types+node@22.7.5_sass@1.79.4_terser@5.34.1/node_modules/vite/dist/node/index.js";
import dts from "file:///home/anuj/projects/UniMind/node_modules/.pnpm/vite-plugin-dts@4.2.3_@types+node@22.7.5_rollup@4.24.0_typescript@5.6.3_vite@5.4.8_@types+nod_nihdndekolieojbkdi3ouixn54/node_modules/vite-plugin-dts/dist/index.mjs";

// vite.preview.config.ts
import { defineConfig } from "file:///home/anuj/projects/UniMind/node_modules/.pnpm/vite@5.4.8_@types+node@22.7.5_sass@1.79.4_terser@5.34.1/node_modules/vite/dist/node/index.js";
import vue from "file:///home/anuj/projects/UniMind/node_modules/.pnpm/@vitejs+plugin-vue@5.1.4_vite@5.4.8_@types+node@22.7.5_sass@1.79.4_terser@5.34.1__vue@3.5.11_typescript@5.6.3_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidml0ZS5wcmV2aWV3LmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2FudWovcHJvamVjdHMvVW5pTWluZC9VbmlNaW5kVUlSZXBsXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9hbnVqL3Byb2plY3RzL1VuaU1pbmQvVW5pTWluZFVJUmVwbC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9hbnVqL3Byb2plY3RzL1VuaU1pbmQvVW5pTWluZFVJUmVwbC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IHR5cGUgUGx1Z2luLCBtZXJnZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcbmltcG9ydCBiYXNlIGZyb20gJy4vdml0ZS5wcmV2aWV3LmNvbmZpZydcbmltcG9ydCBmcyBmcm9tICdub2RlOmZzJ1xuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJ1xuXG5jb25zdCBnZW5TdHViOiBQbHVnaW4gPSB7XG4gIG5hbWU6ICdnZW4tc3R1YicsXG4gIGFwcGx5OiAnYnVpbGQnLFxuICBnZW5lcmF0ZUJ1bmRsZSgpIHtcbiAgICB0aGlzLmVtaXRGaWxlKHtcbiAgICAgIHR5cGU6ICdhc3NldCcsXG4gICAgICBmaWxlTmFtZTogJ3Nzci1zdHViLmpzJyxcbiAgICAgIHNvdXJjZTogYG1vZHVsZS5leHBvcnRzID0ge31gLFxuICAgIH0pXG4gIH0sXG59XG5cbi8qKlxuICogUGF0Y2ggZ2VuZXJhdGVkIGVudHJpZXMgYW5kIGltcG9ydCB0aGVpciBjb3JyZXNwb25kaW5nIENTUyBmaWxlcy5cbiAqIEFsc28gbm9ybWFsaXplIE1vbmFjb0VkaXRvci5jc3NcbiAqL1xuY29uc3QgcGF0Y2hDc3NGaWxlczogUGx1Z2luID0ge1xuICBuYW1lOiAncGF0Y2gtY3NzJyxcbiAgYXBwbHk6ICdidWlsZCcsXG4gIHdyaXRlQnVuZGxlKCkge1xuICAgIC8vIDEuIE1vbmFjb0VkaXRvci5jc3MgLT4gbW9uYWNvLWVkaXRvci5jc3NcbiAgICBjb25zdCBvdXREaXIgPSBwYXRoLnJlc29sdmUoJ2Rpc3QnKVxuICAgIGZzLnJlbmFtZVN5bmMoXG4gICAgICBwYXRoLnJlc29sdmUob3V0RGlyLCAnTW9uYWNvRWRpdG9yLmNzcycpLFxuICAgICAgcGF0aC5yZXNvbHZlKG91dERpciwgJ21vbmFjby1lZGl0b3IuY3NzJyksXG4gICAgKVxuXG4gICAgLy8gMi4gaW5qZWN0IGNzcyBpbXBvcnRzIHRvIHRoZSBmaWxlc1xuICAgIDtbJ3Z1ZS1yZXBsJywgJ21vbmFjby1lZGl0b3InXS5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGgucmVzb2x2ZShvdXREaXIsIGZpbGUgKyAnLmpzJylcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsICd1dGYtOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGZpbGVQYXRoLCBgaW1wb3J0ICcuLyR7ZmlsZX0uY3NzJ1xcbiR7Y29udGVudH1gKVxuICAgIH0pXG4gIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IG1lcmdlQ29uZmlnKGJhc2UsIHtcbiAgcGx1Z2luczogW1xuICAgIGR0cyh7XG4gICAgICByb2xsdXBUeXBlczogdHJ1ZSxcbiAgICB9KSxcbiAgICBnZW5TdHViLFxuICAgIHBhdGNoQ3NzRmlsZXMsXG4gIF0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIC8vIGF2b2lkIGxhdGUgZGlzY292ZXJlZCBkZXBzXG4gICAgaW5jbHVkZTogW1xuICAgICAgJ3R5cGVzY3JpcHQnLFxuICAgICAgJ21vbmFjby1lZGl0b3ItY29yZS9lc20vdnMvZWRpdG9yL2VkaXRvci53b3JrZXInLFxuICAgICAgJ3Z1ZS9zZXJ2ZXItcmVuZGVyZXInLFxuICAgIF0sXG4gIH0sXG4gIGJhc2U6ICcuLycsXG4gIGJ1aWxkOiB7XG4gICAgZW1wdHlPdXREaXI6IGZhbHNlLFxuICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgbWluaWZ5OiBmYWxzZSxcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiB7XG4gICAgICAgICd2dWUtcmVwbCc6ICcuL3NyYy9pbmRleC50cycsXG4gICAgICAgICdtb25hY28tZWRpdG9yJzogJy4vc3JjL2VkaXRvci9Nb25hY29FZGl0b3IudnVlJ1xuICAgICAgfSxcbiAgICAgIGZvcm1hdHM6IFsnZXMnXSxcbiAgICAgIGZpbGVOYW1lOiAoKSA9PiAnW25hbWVdLmpzJyxcbiAgICB9LFxuICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdjaHVua3MvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICB9LFxuICAgICAgZXh0ZXJuYWw6IFtcbiAgICAgICAgJ3Z1ZScsXG4gICAgICAgICd2dWUvY29tcGlsZXItc2ZjJyxcbiAgICAgICAgJ0B1bmltaW5kc29mdHdhcmUvYXBwLWxvYWRlcicsXG4gICAgICAgICdsb2Rhc2gtZXMnLFxuICAgICAgICAnQHVuaW1pbmRzb2Z0d2FyZS9jb3JlJyxcbiAgICAgICAgJ0B1bmltaW5kc29mdHdhcmUvcm91dGVyJyxcbiAgICAgICAgJ0B1bmltaW5kc29mdHdhcmUvcm91dGVyL21vY2snLFxuICAgICAgICAvQHZ1ZVxcLy4qLyxcbiAgICAgICAgL0B1bmltaW5kc29mdHdhcmVcXC9wbHVnaW4tdnVlXFwvLiovXG4gICAgICBdLFxuICAgIH0sXG4gIH0sXG59KVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9hbnVqL3Byb2plY3RzL1VuaU1pbmQvVW5pTWluZFVJUmVwbFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvYW51ai9wcm9qZWN0cy9VbmlNaW5kL1VuaU1pbmRVSVJlcGwvdml0ZS5wcmV2aWV3LmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9hbnVqL3Byb2plY3RzL1VuaU1pbmQvVW5pTWluZFVJUmVwbC92aXRlLnByZXZpZXcuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHJlcGxhY2UgZnJvbSAnQHJvbGx1cC9wbHVnaW4tcmVwbGFjZSdcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3Z1ZSgpXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQHZ1ZS9jb21waWxlci1kb20nOiAnQHZ1ZS9jb21waWxlci1kb20vZGlzdC9jb21waWxlci1kb20uY2pzLmpzJyxcbiAgICAgICdAdnVlL2NvbXBpbGVyLWNvcmUnOiAnQHZ1ZS9jb21waWxlci1jb3JlL2Rpc3QvY29tcGlsZXItY29yZS5janMuanMnLFxuICAgICAgJ0B1bmltaW5kc29mdHdhcmUvcGx1Z2luLXZ1ZS9jb21waWxlcic6ICcuL25vZGVfbW9kdWxlcy9AdW5pbWluZHNvZnR3YXJlL3BsdWdpbi12dWUvZGlzdC9jb21waWxlci5tanMnLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgY29tbW9uanNPcHRpb25zOiB7XG4gICAgICBpZ25vcmU6IFsndHlwZXNjcmlwdCddLFxuICAgIH0sXG4gIH0sXG4gIHdvcmtlcjoge1xuICAgIGZvcm1hdDogJ2VzJyxcbiAgICBwbHVnaW5zOiAoKSA9PiBbXG4gICAgICByZXBsYWNlKHtcbiAgICAgICAgcHJldmVudEFzc2lnbm1lbnQ6IHRydWUsXG4gICAgICAgIHZhbHVlczoge1xuICAgICAgICAgICdwcm9jZXNzLmVudi5OT0RFX0VOVic6IEpTT04uc3RyaW5naWZ5KCdwcm9kdWN0aW9uJyksXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICBdLFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlMsU0FBc0IsbUJBQW1CO0FBQ3RWLE9BQU8sU0FBUzs7O0FDRDZTLFNBQVMsb0JBQW9CO0FBQzFWLE9BQU8sU0FBUztBQUNoQixPQUFPLGFBQWE7QUFFcEIsSUFBTyw4QkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLElBQUksQ0FBQztBQUFBLEVBQ2YsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wscUJBQXFCO0FBQUEsTUFDckIsc0JBQXNCO0FBQUEsTUFDdEIsd0NBQXdDO0FBQUEsSUFDMUM7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxpQkFBaUI7QUFBQSxNQUNmLFFBQVEsQ0FBQyxZQUFZO0FBQUEsSUFDdkI7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixRQUFRO0FBQUEsSUFDUixTQUFTLE1BQU07QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLG1CQUFtQjtBQUFBLFFBQ25CLFFBQVE7QUFBQSxVQUNOLHdCQUF3QixLQUFLLFVBQVUsWUFBWTtBQUFBLFFBQ3JEO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFDSDtBQUFBLEVBQ0Y7QUFDRixDQUFDOzs7QUQxQkQsT0FBTyxRQUFRO0FBQ2YsT0FBTyxVQUFVO0FBRWpCLElBQU0sVUFBa0I7QUFBQSxFQUN0QixNQUFNO0FBQUEsRUFDTixPQUFPO0FBQUEsRUFDUCxpQkFBaUI7QUFDZixTQUFLLFNBQVM7QUFBQSxNQUNaLE1BQU07QUFBQSxNQUNOLFVBQVU7QUFBQSxNQUNWLFFBQVE7QUFBQSxJQUNWLENBQUM7QUFBQSxFQUNIO0FBQ0Y7QUFNQSxJQUFNLGdCQUF3QjtBQUFBLEVBQzVCLE1BQU07QUFBQSxFQUNOLE9BQU87QUFBQSxFQUNQLGNBQWM7QUFFWixVQUFNLFNBQVMsS0FBSyxRQUFRLE1BQU07QUFDbEMsT0FBRztBQUFBLE1BQ0QsS0FBSyxRQUFRLFFBQVEsa0JBQWtCO0FBQUEsTUFDdkMsS0FBSyxRQUFRLFFBQVEsbUJBQW1CO0FBQUEsSUFDMUM7QUFHQyxLQUFDLFlBQVksZUFBZSxFQUFFLFFBQVEsQ0FBQyxTQUFTO0FBQy9DLFlBQU0sV0FBVyxLQUFLLFFBQVEsUUFBUSxPQUFPLEtBQUs7QUFDbEQsWUFBTSxVQUFVLEdBQUcsYUFBYSxVQUFVLE9BQU87QUFDakQsU0FBRyxjQUFjLFVBQVUsYUFBYSxJQUFJO0FBQUEsRUFBVSxPQUFPLEVBQUU7QUFBQSxJQUNqRSxDQUFDO0FBQUEsRUFDSDtBQUNGO0FBRUEsSUFBTyxzQkFBUSxZQUFZLDZCQUFNO0FBQUEsRUFDL0IsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLE1BQ0YsYUFBYTtBQUFBLElBQ2YsQ0FBQztBQUFBLElBQ0Q7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBO0FBQUEsSUFFWixTQUFTO0FBQUEsTUFDUDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE1BQU07QUFBQSxFQUNOLE9BQU87QUFBQSxJQUNMLGFBQWE7QUFBQSxJQUNiLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQSxJQUNSLEtBQUs7QUFBQSxNQUNILE9BQU87QUFBQSxRQUNMLFlBQVk7QUFBQSxRQUNaLGlCQUFpQjtBQUFBLE1BQ25CO0FBQUEsTUFDQSxTQUFTLENBQUMsSUFBSTtBQUFBLE1BQ2QsVUFBVSxNQUFNO0FBQUEsSUFDbEI7QUFBQSxJQUNBLGNBQWM7QUFBQSxJQUNkLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsTUFDQSxVQUFVO0FBQUEsUUFDUjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
