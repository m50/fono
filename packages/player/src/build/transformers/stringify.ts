export const transform = async (input: string, path: string): Promise<string> => {
  const code = `module.exports = \`${input}\`;\nmodule.exports.default = \`${input}\`;\n`;
  return input;
}
