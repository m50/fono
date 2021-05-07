import React, { useEffect } from 'react';
import { RouteComponentProps } from '@reach/router';
import Card from 'components/card';
import { buildQueryParams } from 'lib/helpers';
import { useAddToast } from 'components/toasts';
import { withQuery } from 'components/higher-order/withQuery';
import { DateTime } from 'luxon';
import { useRest } from 'hooks/useApi/useRest';

const PARAMS = {
  client_id: import.meta.env.SPOTIFY_CLIENT_ID,
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

interface Props extends Required<RouteComponentProps> {
  spotify?: {
    config: Record<string, any>;
    createdAt: DateTime;
    updatedAt: DateTime;
  };
}

const SpotifyComponent = ({ location, navigate, uri, spotify }: Props) => {
  const addToast = useAddToast();
  const api = useRest();
  useEffect(() => {
    if (spotify) {
      console.log(spotify);
      return;
    }
    const code = new URLSearchParams(location.search).get('code');
    if (!code) {
      const params = buildQueryParams({ ...PARAMS, redirect_uri: location.href });
      const url = `${SPOTIFY_AUTH}?${params}`;
      navigate(url);
      return;
    }

    navigate(uri, { replace: true }).then(() => {
      addToast({
        title: 'Logged into Spotify',
        body: 'Authenticated with Spotify, setting it up now.',
        type: 'info',
      });
      return api('POST', '/music/spotify/login', { redirectUri: location.href, code });
    }).then(() => {
      addToast({
        title: 'Success!',
        body: 'Spotify is setup.',
        type: 'success',
      });
    });
  }, []);

  return (
    <div className="w-full px-2 space-y-2">
      <Card>
        <Card.Body>
        </Card.Body>
      </Card>
    </div>
  );
};

export const Spotify = withQuery(
  (gql) => gql`
    query Spotify {
      audioConfig(type: 'spotify') {
        config
        createdAt
        updatedAt
      }
    }
  `,
  SpotifyComponent,
);
