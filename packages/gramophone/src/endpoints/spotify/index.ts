import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { auth } from 'middleware/auth';
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
    const spotify = new SpotifyWebApi({
      redirectUri: req.body.redirectUri,
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
    const res = await spotify.authorizationCodeGrant(req.body.code);
    return { code: 200, message: 'Successfuly logged into Spotify.' };
  });

  done();
};
