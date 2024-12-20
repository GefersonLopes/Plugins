import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {}, // Define `process.env` como um objeto vazio no navegador
  },
  build: {
    lib: {
      entry: "./src/main.jsx",
      name: "ReactIframePlugin",
      fileName: "react-iframe-plugin",
      formats: ["iife"],
    },
    outDir: "dist",
  },
});
