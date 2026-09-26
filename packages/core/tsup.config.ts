import { defineConfig, type Options } from 'tsup';

export default defineConfig((options: Options) => ({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    // DTS solo en build final, no en watch (2x más rápido en dev)
    dts: !options.watch,
    splitting: false,
    sourcemap: true,
    clean: true,
    minify: false,
    target: 'es2020',
    treeshake: true,
}));
