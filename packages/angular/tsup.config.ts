import { defineConfig, type Options } from 'tsup';

export default defineConfig((options: Options) => ({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: !options.watch,
    splitting: false,
    sourcemap: true,
    clean: true,
    minify: false,
    target: 'es2020',
    treeshake: true,
    external: ['@angular/core', '@angular/common'],
}));
