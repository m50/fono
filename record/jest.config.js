/* eslint-disable import/no-extraneous-dependencies */
const snowpackJest = require('@snowpack/app-scripts-react/jest.config.js');

module.exports = {
  ...snowpackJest(),
  clearMocks: true,
  setupFilesAfterEnv: [
    '<rootDir>/prepare.ts',
  ],
  testMatch: [
    '<rootDir>/src/**/?(*.)+(spec|test).[tj]sx',
    '<rootDir>/src/**/?*.(spec|test).[tj]s',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],
  moduleDirectories: ['<rootDir>/src', '<rootDir>/node_modules', '<rootDir>/../node_modules'],
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
  ],
  testURL: 'http://localhost',
  snapshotResolver: '<rootDir>/snapshotResolver.js',
};
