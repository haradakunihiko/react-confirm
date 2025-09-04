module.exports = {
    testEnvironment: 'jsdom',
    preset: 'ts-jest',
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: [
        '**/__tests__/**/*.(ts|tsx)',
        '**/*.(test|spec).(ts|tsx)',
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    moduleNameMapper: {
        '^src$': '<rootDir>/src/index.ts',
    },
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        'typescript/**/*.{ts,d.ts}',
        '!**/*.d.ts',
        '!**/node_modules/**',
    ],
};
