import React, { useEffect } from 'react';
import { RouteComponentProps } from '@reach/router';
import Card from 'components/card';
import { buildQueryParams } from 'lib/helpers';
import { useAddToast } from 'components/toasts';
import { withQuery } from 'components/higher-order/withQuery';
import { DateTime } from 'luxon';
import { isCreatedResponse, isSuccessResponse, useRest } from 'hooks/useApi/useRest';
import { Spotify as SpotifyConfig } from '@fono/gramophone/src/schema/AudioConfig';

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
  audioConfig: {
    config: SpotifyConfig;
    createdAt: DateTime;
    updatedAt: DateTime;
  };
}

const SpotifyComponent = ({ location, navigate, uri, audioConfig: spotify }: Props) => {
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
      window.location.href = url;
      return;
    }

    navigate(uri, { replace: true }).then(() => {
      addToast({
        title: 'Logged into Spotify',
        body: 'Authenticated with Spotify, setting it up now.',
        type: 'info',
      });
      return api('POST', '/music/spotify/login', { redirectUri: location.href.replace(/\?.+$/, ''), code });
    }).then((res) => {
      if (isCreatedResponse(res) || isSuccessResponse(res)) {
        addToast({
          title: 'Success!',
          body: `Spotify is setup.\n${res.message}`,
          type: 'success',
        });
      } else {
        addToast({
          title: 'Warning!',
          body: res.message,
          type: 'warning',
        });
      }
    }).catch((err) => {
        addToast({
          title: 'Error!',
          body: err.toString(),
          type: 'error',
        });
    });
  }, []);

  return (
    <div className="w-full px-2 space-y-2">
      <Card>
        <Card.Body>
          <pre>{JSON.stringify(spotify.config, null, 2)}</pre>
        </Card.Body>
      </Card>
    </div>
  );
};

export const Spotify = withQuery(
  (gql) => gql`
    query Spotify {
      audioConfig(type: "spotify") {
        config
        createdAt
        updatedAt
      }
    }
  `,
  SpotifyComponent,
);
