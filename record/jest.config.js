module.exports = {
  clearMocks: true,
  setupFiles: [
    '<rootDir>/prepare.ts',
  ],
  testMatch: [
    '<rootDir>/src/**/?(*.)+(spec|test).[tj]sx',
    '<rootDir>/src/**/?(*.)+(spec|test).[tj]s',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/../node_modules/',
    '<rootDir>/public/',
    '<rootDir>/.next/',
    '<rootDir>/out/',
  ],
  moduleDirectories: ['<rootDir>/src', '<rootDir>/node_modules', '<rootDir>/../node_modules'],
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
    'tsx',
    'jsx',
  ],
  testURL: 'http://localhost',
  snapshotResolver: '<rootDir>/snapshotResolver.ts',
};
