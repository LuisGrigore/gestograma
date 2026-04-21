import { defineConfig } from "vite"

export default defineConfig({
  build: {
    minify: false,

    lib: {
      entry: "src/index.ts",
      name: "Subsystem",
      formats: ["iife"],
      fileName: () => "subsystem.js",
    },

    target: "es2020",

    outDir: "../build",

    emptyOutDir: false,
  },
});