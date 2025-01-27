import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // Pasta onde os arquivos gerados serão salvos
    emptyOutDir: true, // Limpa a pasta dist antes de cada build
  },
  server: {
    port: 3000, // Porta para desenvolvimento
  },
});
