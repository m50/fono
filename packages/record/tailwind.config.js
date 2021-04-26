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
    extend: {
      shadowFill: ['autofill'],
      textColor: ['active'],
      backgroundColor: ['active'],
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
    require('./src/styles/tailwind-autofill'),
  ],
};
