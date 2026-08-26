import * as migration_20260826_131212_baseline from './20260826_131212_baseline';

export const migrations = [
  {
    up: migration_20260826_131212_baseline.up,
    down: migration_20260826_131212_baseline.down,
    name: '20260826_131212_baseline',
  },
];
