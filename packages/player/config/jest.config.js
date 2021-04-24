const { dirname } = require('path');

/** @type { import("@jest/types").Config } */
module.exports = {
  verbose: true,
  clearMocks: true,
  rootDir: dirname(__dirname),
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: [
  ],
  testMatch: [
    '<rootDir>/src/**/?*.(spec|test).[tj]s',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/../../node_modules/',
    '<rootDir>/dist/',
  ],
  moduleDirectories: [
    '<rootDir>/src',
    '<rootDir>/node_modules',
    '<rootDir>/../../node_modules',
  ],
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
  ],
  testURL: 'http://localhost',
};
