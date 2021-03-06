import { DateTime } from 'luxon';
import db from 'setup/db';

export const timestamp = 1620363602644;

export const AudioConfigs = <C extends {} = Record<string, any>>() => db<AudioConfig<C>>('audio_configs');
export const SpotifyConfig = (id?: number) => AudioConfigs<Spotify>()
  .where('type', 'spotify')
  .maybeWhere('id', id)
  .first();

export interface Spotify {
  accountName: string;
  redirectUri: string;
  accessToken: string;
  expiresIn: number;
  expiresAt: DateTime | Date;
  refreshToken: string;
  tokenType: string;
  scope: string;
}

export interface AudioConfig<C extends {} = Record<string, any>> {
  id: number;
  type: 'spotify';
  config: C;

  createdAt: DateTime | Date;
  updatedAt: DateTime | Date;
}

export const up = async () => {
  await db.schema.createTable('audio_configs', (table) => {
    table.increments();
    table.string('type').index().unique();
    table.json('config');

    table.timestamp('createdAt').defaultTo(db.fn.now());
    table.timestamp('updatedAt').defaultTo(db.fn.now());
  });
};

export const down = async () => {
  await db.schema.dropTableIfExists('audio_configs');
};
