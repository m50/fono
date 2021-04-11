module.exports = {
  testPathForConsistencyCheck: 'some/example.test.js',
  resolveSnapshotPath: (testPath, snapshotExtension) => testPath.replace('.test', snapshotExtension),
  resolveTestPath: (snapshotFilePath, snapshotExtension) => snapshotFilePath.replace(snapshotExtension, '.test'),
};
