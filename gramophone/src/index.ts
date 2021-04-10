import './env';
import 'whatwg-fetch';
import chalk from 'chalk';
import app from './app';

const PORT = process.env.PORT ?? 3000;
const URL = process.env.BASE_URL ?? `http://127.0.0.1:${PORT}`;

const start = async () => {
  console.log(`\n\t🎉 Server started at ${chalk.cyan(`${URL}/`)} 🎉\n`);
  try {
    await app.listen(PORT, '0.0.0.0');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
