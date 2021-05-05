/* eslint-disable import/no-extraneous-dependencies */
const plugin = require('tailwindcss/plugin');
const flatten = require('flatten-tailwindcss-theme');

const autofill = plugin(({ addUtilities, variants, theme, addVariant, e }) => {
  addVariant('autofill', ({ modifySelectors, separator }) => {
    modifySelectors(({ className }) => {
      const newClass = e(`autofill${separator}${className}`);
      return [
        `.${newClass}:-webkit-autofill`,
        `.${newClass}:-webkit-autofill:hover`,
        `.${newClass}:-webkit-autofill:focus`,
      ].join(',');
    });
  });

  const colors = flatten(theme('colors'));
  const utils = Object.entries(colors).reduce(
    (res, [key, value]) => Object.assign(res, {
      [`.${e(`shadow-fill-${key}`)}`]: {
        '--tw-shadow': `0 0 0 9999px ${value} inset`,
        'background-color': `${value} !important`,
        background: `${value} !important`,
        '-webkit-box-shadow':
          'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow) !important',
        '-moz-box-shadow':
          'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow) !important',
        boxShadow:
          'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow) !important',
      },
    }),
    {},
  );
  addUtilities(utils, variants('text', 'shadowFill'));
}, {
  variants: {
    shadowFill: [],
  },
});

module.exports = autofill;
