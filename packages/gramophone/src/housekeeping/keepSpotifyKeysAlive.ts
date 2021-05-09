import { FastifyInstance } from "fastify";
import { DateTime } from "luxon";
import { AudioConfig, AudioConfigs, Spotify } from "schema/AudioConfig";
import SpotifyWebApi from "spotify-web-api-node";

let intervals: NodeJS.Timeout[] = [];
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

const refreshToken = async (config: AudioConfig<Spotify>, app: FastifyInstance) => {
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
    intervals.push(setInterval(refreshToken, (spotifyConfig.config.expiresIn - 60) * 1000, spotifyConfig, app));
    setImmediate(refreshToken, spotifyConfig, app);
  });
};
