import { defineConfig } from "vite"

export default defineConfig({
  build: {
    minify: false,

    lib: {
      entry: "src/index.ts",   // 👈 cambia al entry correcto
      name: "Subsystem",
      formats: ["iife"],           // 👈 CLAVE (compatible con script clásico)
      fileName: () => "subsystem.js",
    },

    target: "es2020",

    outDir: "../build",           // 👈 se mantiene igual

    emptyOutDir: false,           // 👈 IMPORTANTE: NO borra el directorio
  },
});