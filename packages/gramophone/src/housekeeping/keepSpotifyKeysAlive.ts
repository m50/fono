import { FastifyInstance } from 'fastify';
import { DateTime } from 'luxon';
import { AudioConfigs, Spotify, SpotifyConfig } from 'schema/AudioConfig';
import SpotifyWebApi from 'spotify-web-api-node';

let intervals: any[] = [];
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

const handleTokenRefresh = async (id: number, app: FastifyInstance) => {
  const config = await SpotifyConfig(id);
  if (!config) {
    clearTimeout(intervals[id]);
    delete intervals[id];
    return;
  }
  const { redirectUri, accessToken, accountName, refreshToken } = config.config;
  try {
    const spotify = new SpotifyWebApi({ redirectUri, accessToken, clientId, clientSecret, refreshToken });
    const res = await spotify.refreshAccessToken();
    const { body: auth } = res;
    await AudioConfigs<Spotify | string>().where('id', config.id).update({
      updatedAt: DateTime.now().toJSDate(),
      config: JSON.stringify({
        accountName,
        redirectUri,
        refreshToken,
        accessToken: auth.access_token,
        expiresIn: auth.expires_in,
        expiresAt: DateTime.now().plus({ milliseconds: auth.expires_in }),
        tokenType: auth.token_type,
        scope: auth.scope,
      }),
    });
    app.log.info(`Updated Spotify authentication[${config.id}].`, config);
  } catch (err) {
    app.log.error(err, config);
  }
};

export const keepSpotifyKeysAlive = async (app: FastifyInstance) => {
  const spotifyConfigs = await AudioConfigs<Spotify>().where('type', 'spotify');

  intervals.forEach((interval) => clearInterval(interval));
  intervals = [];

  spotifyConfigs.forEach((spotifyConfig) => {
    intervals[spotifyConfig.id] = setInterval(
      handleTokenRefresh,
      (spotifyConfig.config.expiresIn - 60) * 1000,
      spotifyConfig.id,
      app,
    );
    setImmediate(handleTokenRefresh, spotifyConfig.id, app);
  });
};
