module.exports = {
  testPathForConsistencyCheck: 'some/example.test.ts',
  resolveSnapshotPath: (testPath, snapshotExtension) => testPath + snapshotExtension,
  resolveTestPath: (snapshotFilePath, snapshotExtension) => snapshotFilePath.replace(snapshotExtension, ''),
};
