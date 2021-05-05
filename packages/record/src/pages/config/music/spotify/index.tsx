import React from 'react';
import { RouteComponentProps } from '@reach/router';
import Card from 'components/card';

const client_id: string = import.meta.env.SPOTIFY_CLIENT_ID;
const PARAMS = {
  client_id,
  response_type: 'code',
  scope: [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-library-read',
    'user-library-modify',
    'user-read-playback-state',
    'user-modify-playback-state',
  ].join('%20'),
};
const SPOTIFY_AUTH = 'https://accounts.spotify.com/authorize';

export const Spotify = ({ location }: RouteComponentProps) => {
  const params = Object
    .entries({ ...PARAMS, redirect_uri: encodeURIComponent(location?.href as string) })
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
  const url = `${SPOTIFY_AUTH}?${params}`;
  return (
    <div className="w-full px-2 space-y-2">
      <Card>
        <Card.Body>
          <a href={url} className="text-white hover:text-green-400 text-4xl">Log into spotify</a>
        </Card.Body>
      </Card>
    </div>
  );
}
