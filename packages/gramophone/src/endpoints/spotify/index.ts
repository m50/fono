import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { DateTime } from 'luxon';
import { auth } from 'middleware/auth';
import { AudioConfigs, SpotifyConfig, Spotify } from 'schema/AudioConfig';
import SpotifyWebApi from 'spotify-web-api-node';
import loginSchema from './login.schema.json';
import accountNameSchema from './account-name.schema.json';

export const register: FastifyPluginCallback<{}> = (app: FastifyInstance, _, done) => {
  auth(app);

  interface LoginRequest {
    Body: {
      redirectUri: string;
      code: string;
    };
  }
  app.post<LoginRequest>('/music/spotify', { schema: { body: loginSchema } }, async (req, res) => {
    const spotifyConfig = await SpotifyConfig();
    if (spotifyConfig) {
      res.status(409);
      return { statusCode: 409, message: 'Spotify is already configured.' };
    }

    const { redirectUri } = req.body;

    const spotify = new SpotifyWebApi({
      redirectUri,
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
    try {
      const { body: auth } = await spotify.authorizationCodeGrant(req.body.code);
      spotify.setAccessToken(auth.access_token)
      const { body: user } = await spotify.getMe();
      await AudioConfigs<Spotify | string>().insert({
        type: 'spotify',
        config: JSON.stringify({
          accountName: user.display_name ?? user.email,
          redirectUri,
          accessToken: auth.access_token,
          expiresIn: auth.expires_in,
          expiresAt: DateTime.now().plus({ milliseconds: auth.expires_in }),
          refreshToken: auth.refresh_token,
          tokenType: auth.token_type,
          scope: auth.scope,
        }),
      });

      res.status(201);
      return { statusCode: 201, message: 'Successfuly configured Spotify.' };
    } catch (err) {
      res.status(500);
      return { statusCode: 500, message: err.toString() };
    }
  });
  app.patch<LoginRequest>('/music/spotify', { schema: { body: loginSchema } }, async (req, res) => {
    const spotifyConfig = await SpotifyConfig();
    if (!spotifyConfig) {
      res.status(409);
      return { statusCode: 409, message: 'Spotify is not yet configured. Did you run initial authorization?' };
    }

    const { redirectUri } = req.body;

    const spotify = new SpotifyWebApi({
      redirectUri,
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
    try {
      const { body: auth } = await spotify.authorizationCodeGrant(req.body.code);
      await AudioConfigs<Spotify | string>().where('type', 'spotify').update({
        type: 'spotify',
        config: JSON.stringify({
          accountName: spotifyConfig.config.accountName,
          redirectUri,
          accessToken: auth.access_token,
          expiresIn: auth.expires_in,
          expiresAt: DateTime.now().plus({ milliseconds: auth.expires_in }),
          refreshToken: auth.refresh_token,
          tokenType: auth.token_type,
          scope: auth.scope,
        }),
      });

      res.status(200);
      return { statusCode: 200, message: 'Successfuly re-authorized Spotify.' };
    } catch (err) {
      res.status(500);
      return { statusCode: 500, message: err.toString() };
    }
  });

  interface AccountNameRequest {
    Body: {
      accountName: string;
    };
  }
  app.patch<AccountNameRequest>(
    '/music/spotify/account-name',
    { schema: { body: accountNameSchema } },
    async (req, res) => {
      const config = await SpotifyConfig();
      if (!config) {
        res.status(409);
        return { statusCode: 409, message: 'Spotify is not yet configured.' };
      }
      config.config.accountName = req.body.accountName;
      try {
        await AudioConfigs<string>().where('type', 'spotify').update({
          config: JSON.stringify(config.config),
          updatedAt: DateTime.now().toJSDate(),
        });
        res.status(200);
        return { statusCode: 200, message: `Account name updated to ${req.body.accountName}` };
      } catch (err) {
        res.status(500);
        return { statusCode: 500, message: err.toString() };
      }
    }
  );

  app.delete('/music/spotify', async (req, res) => {
    try {
      await AudioConfigs().where('type', 'spotify').delete();
      res.status(204);
      return { statusCode: 204 };
    } catch (err) {
      res.status(500);
      return { statusCode: 500, message: err.toString() };
    }
  });

  done();
};
