/* eslint-disable import/no-extraneous-dependencies */
const snowpackJest = require('@snowpack/app-scripts-react/jest.config.js');
const { dirname } = require('path');

module.exports = {
  rootDir: dirname(__dirname),
  transform: {
    '\\.[tj]s$': ['babel-jest', { configFile: './config/.babelrc.json' }],
  },
  ...snowpackJest(),
  clearMocks: true,
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
