import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vite";

// // https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // server: { port: import.meta.env.VITE_PORT },
  root: ".",
  build: {
    sourcemap: true,
    outDir: "./dist",
  },
  resolve: {
    extensions: [".js", ".ts", ".json", ".vue"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
