/* eslint-disable */
module.exports = {
  mode: 'jit',
  darkMode: 'media',
  future: {
    purgeLayersByDefault: true,
  },
  purge: {
    layers: ['utilities'],
    content: ['./src/**/*.{js,ts,jsx,tsx}', './public/*.html'],
  },
  theme: {
  },
  variants: {
    extends: {
      shadowFill: ['autofill'],
    },
  },
  plugins: [
    require('@tailwindcss/forms')({}),
    require('@tailwindcss/typography'),
    require('./src/styles/tailwind-autofill'),
  ],
};
