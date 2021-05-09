/* eslint-disable import/no-extraneous-dependencies */
const snowpackJest = require('@snowpack/app-scripts-react/jest.config.js');
const { dirname } = require('path');

module.exports = {
  rootDir: dirname(__dirname),
  ...snowpackJest(),
  clearMocks: true,
  maxWorkers: 1,
  setupFilesAfterEnv: [
    '<rootDir>/config/jest.setup.ts',
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
    'tsx',
    'jsx',
  ],
  testURL: 'http://localhost',
  snapshotResolver: '<rootDir>/config/snapshotResolver.js',
};
