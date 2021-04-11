export default {
  testPathForConsistencyCheck: 'some/example.test.ts',
  resolveSnapshotPath: (testPath: string, snapshotExtension: string) => testPath.replace('.test', snapshotExtension),
  resolveTestPath: (snapshotFilePath: string, snapshotExtension: string) => snapshotFilePath
    .replace(snapshotExtension, '.test'),
};
