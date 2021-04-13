
export const log = (silent: boolean, ...toLog: any) => {
  if (silent) {
    return;
  }

  console.log(...toLog);
};
