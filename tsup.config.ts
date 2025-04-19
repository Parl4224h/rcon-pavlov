import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/**/*.ts"],    // compile every .ts under src
    format: ["cjs", "esm"],     // still emit both CommonJS & ESM
    outDir: "dist",             // where your .js/.mjs and .d.ts go
    dts: true,                  // generate declarations
    bundle: false,              // ← do NOT bundle everything into one file
    splitting: false,           // no code‑splitting chunks
    sourcemap: true,
    clean: true,
});