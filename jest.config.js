module.exports = {
    testEnvironment: 'jsdom',
    preset: 'ts-jest/presets/js-with-ts',
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'ts-jest',
    },
    testMatch: [
        '**/__tests__/**/*.(js|ts|tsx)',
        '**/*.(test|spec).(js|ts|tsx)',
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    moduleNameMapper: {
        '^src$': '<rootDir>/src/index.ts',
    },
    collectCoverageFrom: [
        'src/**/*.{js,ts,tsx}',
        '!**/*.d.ts',
        '!**/node_modules/**',
    ],
};
