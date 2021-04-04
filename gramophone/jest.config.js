module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
  ],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
  ],
  coverageProvider: 'v8',
  coverageReporters: [
    'text',
  ],
  setupFiles: [
    '<rootDir>/prepare.js',
  ],
  testMatch: [
    '<rootDir>/src/**/?(*.)+(spec|test).[tj]s?',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/public/',
    '<rootDir>/.next/',
    '<rootDir>/.out/',
  ],
  moduleDirectories: ['<rootDir>/src', '<rootDir>/node_modules'],
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
    'tsx',
    'jsx'
  ],
  testURL: 'http://localhost',
};
