export interface Migration {
  up: () => Promise<void>;
  down: () => Promise<void>;
  timestamp: number;
  [key: string]: unknown;
}

export type MigrationFile = [string, Migration];
