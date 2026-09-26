/** @type {import('jest').Config} */
module.exports = {
    // SWC es 3-5x más rápido que ts-jest (compila TS en Rust, sin type-check)
    // El type-check se hace en lint: tsc --noEmit
    transform: {
        '^.+\\.ts$': ['@swc/jest'],
    },
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.test.ts'],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/__tests__/**',
        '!src/index.ts',
        '!src/types.ts',
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    coverageReporters: ['text', 'lcov'],
};
