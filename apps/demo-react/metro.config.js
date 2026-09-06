/**
 * Metro config para monorepo pnpm.
 * Resuelve @ds-yoandry/* desde el source TypeScript directamente,
 * sin necesidad de compilar los packages para desarrollo.
 */

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Decirle a Metro que observe el monorepo completo
config.watchFolders = [monorepoRoot];

// 2. Orden de resolución: primero local, luego raíz del monorepo
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(monorepoRoot, 'node_modules'),
];

// 3. Apuntar @ds-yoandry/* al source TypeScript directamente
config.resolver.extraNodeModules = {
    '@ds-yoandry/core': path.resolve(monorepoRoot, 'packages/core/src'),
    '@ds-yoandry/react': path.resolve(monorepoRoot, 'packages/react/src'),
};

// 4. Asegurar que Metro procese .ts y .tsx de los packages
config.resolver.sourceExts = [
    ...config.resolver.sourceExts,
    'ts',
    'tsx',
    'mjs',
    'cjs',
];

module.exports = config;
