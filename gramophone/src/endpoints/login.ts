import app from 'setup/app';

app.post('/login', async (req, reply) => {
  if (!req.user) {
    reply.status(401);
    return { message: 'Authentication failed' };
  }

  reply.status(200);
  return { message: 'Successfully logged in!' };
});
