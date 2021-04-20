import db from 'setup/db';

export const closeConnection = () => db.destroy();

export const log = (silent: boolean, ...toLog: any) => {
  if (silent) {
    return;
  }

  console.log(...toLog);
};
