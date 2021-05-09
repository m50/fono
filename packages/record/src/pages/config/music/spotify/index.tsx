import React, { useCallback, useEffect, useRef } from 'react';
import { RouteComponentProps } from '@reach/router';
import Card from 'components/card';
import { buildQueryParams } from 'lib/helpers';
import { useAddToast } from 'components/toasts';
import { withQuery } from 'components/higher-order/withQuery';
import { SpotifyIcon, hoverColorClass } from 'components/svg/spotify';
import { MenuLink } from 'components/styled/menu-link';
import { isCreatedResponse, isDeleteResponse, isSuccessResponse, useRest } from 'hooks/useApi/useRest';
import { AudioConfig, Spotify as SpotifyConfig } from '@fono/gramophone/src/schema/AudioConfig';
import Button from 'components/input/button';
import { useApolloClient } from '@apollo/client';
import TextInput from 'components/input/text';

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

interface Props extends RouteComponentProps {
  audioConfig?: AudioConfig;
}

const SpotifyComponent = ({ location, navigate, uri, audioConfig: spotify }: Props) => {
  const accountName = useRef<HTMLInputElement | null>(null);
  const addToast = useAddToast();
  const api = useRest();
  const client = useApolloClient();
  const authenticate = useCallback(async () => {
    const code = new URLSearchParams(location?.search).get('code');
    const href = location?.href.replace(/\?.*$/, '');
    if (!code) {
      const params = buildQueryParams({ ...PARAMS, redirect_uri: href });
      const url = `${SPOTIFY_AUTH}?${params}`;
      window.location.href = url;
      return;
    }
    await client.resetStore();

    await navigate?.(uri as string, { replace: true });
    addToast({
      title: 'Logged into Spotify',
      body: 'Authenticated with Spotify, setting it up now.',
      type: 'info',
    });
    const res = await api(spotify ? 'PATCH' : 'POST', '/music/spotify', { redirectUri: href, code });
    if (isCreatedResponse(res) || isSuccessResponse(res)) {
      addToast({ title: 'Success!', body: `Spotify is setup.\n${res.message}`, type: 'success' });
    } else {
      addToast({ title: 'Uh oh!', body: res.message, type: 'warning' });
    }
  }, []);

  const logout = useCallback(async () => {
    const res = await api('DELETE', '/music/spotify');
    client.resetStore();
    if (isDeleteResponse(res)) {
      addToast({ title: 'Success!', body: 'De-authenticated Spotify', type: 'success' });
    } else {
      addToast({ title: 'Uh oh!', body: res.message, type: 'warning' });
    }
    navigate?.('../');
  }, []);

  const updateAccountName = useCallback(async () => {
    const res = await api('PATCH', '/music/spotify/account-name', {
      accountName: accountName.current?.value,
    });
    if (isSuccessResponse(res)) {
      addToast({
        type: 'success',
        title: 'Updated!',
        body: res.message,
      });
    } else {
      addToast({
        type: 'warning',
        title: 'Uh oh!',
        body: res.message,
      });
    }
  }, [accountName]);

  useEffect(() => {
    if (spotify) return;
    authenticate();
  }, []);

  return (
    <div className="w-full px-2 space-y-2">
      <Card>
        <Card.Title>Spotify</Card.Title>
        <Card.Body className="flex justify-between items-center">
          <TextInput title="Account Name" className="w-1/2"
            value={spotify?.config.accountName}
            ref={accountName}
          />
          <Button onClick={updateAccountName}>Change name</Button>
        </Card.Body>
        <Card.Footer className="flex justify-between">
          <Button onClick={logout}>Logout of Account</Button>
          <Button onClick={authenticate}>Reauthorize Account</Button>
        </Card.Footer>
      </Card>
    </div>
  );
};

export const Spotify = withQuery<{ audioConfig: AudioConfig }, Props>(
  (gql) => gql`
    # nocache
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

export const SpotifyLink = ({ audioConfig }: { audioConfig: AudioConfig<SpotifyConfig> }) => (
  <MenuLink to="spotify" className={hoverColorClass}>
    <SpotifyIcon className="h-12 mr-2" />
    <span className="flex flex-col">
      <span className="text-2xl text-white">Spotify</span>
      <small className="text-sm text-gray-400">{audioConfig.config.accountName}</small>
    </span>
  </MenuLink>
);
