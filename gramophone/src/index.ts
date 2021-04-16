import 'setup/env';
import 'whatwg-fetch';
import chalk from 'chalk';
import setupServer from 'setup/app';
import up from 'commands/migrate/up';

const PORT = process.env.PORT ?? 3000;
const URL = process.env.BASE_URL ?? `http://127.0.0.1:${PORT}`;

const start = async () => {
  console.log(`\n\t🎉 Server started at ${chalk.cyan(`${URL}/`)} 🎉\n`);
  const app = setupServer();
  try {
    if (process.env.NODE_ENV === 'production') {
      await up();
    }
    await app.listen(PORT, '0.0.0.0');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
