import 'whatwg-fetch';
import fastify, { FastifyRequest as Request } from 'fastify';
import ws, { SocketStream } from 'fastify-websocket';
import chalk from 'chalk';

const PORT = 3000;

const app = fastify({ logger: true });
app.register(ws);

app.get('/', async (request, reply) => {
  reply.type('application/json').code(200);
  return { hello: 'world' };
});

app.get('/ws', { websocket: true }, (connection: SocketStream, request: Request) => {
  connection.socket.on('message', (message: string) => {
    console.log(message);
    connection.socket.send('hello');
  });
});

const start = async () => {
  console.log(`\n\t🎉 Server started at ${chalk.cyan(`http://127.0.0.1:${PORT}/`)} 🎉\n`);
  try {
    await app.listen(3000, '0.0.0.0');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
