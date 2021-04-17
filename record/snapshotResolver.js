module.exports = {
  testPathForConsistencyCheck: 'some/example.test.ts',
  resolveSnapshotPath: (testPath, snapshotExtension) => testPath.replace('.spec', snapshotExtension),
  resolveTestPath: (snapshotFilePath, snapshotExtension) => snapshotFilePath.replace(snapshotExtension, '.spec'),
};
