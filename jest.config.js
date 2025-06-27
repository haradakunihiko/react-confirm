module.exports = {
    testEnvironment: 'jsdom',
    preset: 'ts-jest/presets/js-with-ts',
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    testMatch: [
        '**/__tests__/**/*.(js|ts|tsx)',
        '**/*.(test|spec).(js|ts|tsx)',
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    moduleNameMapper: {
        '^src$': '<rootDir>/src/index.js',
    },
    collectCoverageFrom: [
        'src/**/*.{js,ts,tsx}',
        'typescript/**/*.{ts,d.ts}',
        '!**/*.d.ts',
        '!**/node_modules/**',
    ],
};
