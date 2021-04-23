// eslint-disable-next-line
export const transform = async (input: string, path: string): Promise<string> => {
  if (process.env.NODE_ENV === 'production') {
    return JSON.stringify(JSON.parse(input));
  }

  return input;
};
