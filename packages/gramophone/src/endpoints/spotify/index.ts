import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { DateTime } from 'luxon';
import { auth } from 'middleware/auth';
import { AudioConfigs, SpotifyConfig, Spotify } from 'schema/AudioConfig';
import SpotifyWebApi from 'spotify-web-api-node';

export const register: FastifyPluginCallback<{}> = (app: FastifyInstance, _, done) => {
  auth(app);

  interface LoginRequest {
    Body: {
      redirectUri: string;
      code: string;
    };
  }
  app.post<LoginRequest>('/music/spotify/login', async (req) => {
    const spotifyConfig = await SpotifyConfig();
    if (spotifyConfig) {
      return { statusCode: 409, message: 'Spotify is already configured.' };
    }

    const { redirectUri } = req.body;

    const spotify = new SpotifyWebApi({
      redirectUri,
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
    try {
      const { body } = await spotify.authorizationCodeGrant(req.body.code);
      await AudioConfigs<Spotify | string>().insert({
        type: 'spotify',
        config: JSON.stringify({
          redirectUri,
          accessToken: body.access_token,
          expiresAt: DateTime.now().plus({ milliseconds: body.expires_in }),
          refreshToken: body.refresh_token,
          tokenType: body.token_type,
          scope: body.scope,
        }),
      });

      return { statusCode: 201, message: 'Successfuly configured Spotify.' };
    } catch (err) {
      return { statusCode: 500, message: err.toString() };
    }
  });

  done();
};
