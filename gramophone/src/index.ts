import 'whatwg-fetch';
import fastify from 'fastify';
import chalk from 'chalk';

const PORT = 3000;

const server = fastify({
  logger: true,
});

server.get('/', async (request, reply) => {
  reply.type('application/json').code(200);
  return { hello: 'world' };
});

const start = async () => {
  console.log(`\n\t🎉 Server started at ${chalk.cyan(`http://127.0.0.1:${PORT}/`)} 🎉\n`);
  try {
    await server.listen(3000, '0.0.0.0');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
