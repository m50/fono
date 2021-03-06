const { dirname } = require('path');

module.exports = {
  verbose: true,
  clearMocks: true,
  rootDir: dirname(__dirname),
  setupFiles: [
    '<rootDir>/config/jest.setup.ts',
  ],
  testMatch: [
    '<rootDir>/src/**/?*.(spec|test).[tj]s',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],
  moduleDirectories: ['<rootDir>/src', '<rootDir>/node_modules', '<rootDir>/../../node_modules'],
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
  ],
  testURL: 'http://localhost',
  snapshotResolver: '<rootDir>/config/snapshotResolver.js',
};
