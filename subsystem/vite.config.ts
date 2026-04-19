import { defineConfig } from "vite"

export default defineConfig({
  build: {
	//DESACTIVAR ESTO
	//minify: false,
	minify: true,

    lib: {
      entry: "src/index.ts",
      name: "Gestograma", // nombre global (no crítico)
      formats: ["es"],
      fileName: () => "subsystem.js"
    },
    target: "es2020",
    //outDir: "dist",
	outDir: "../build",
    //emptyOutDir: true
  }
})