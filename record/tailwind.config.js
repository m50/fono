module.exports = {
  future: {
    purgeLayersByDefault: true,
  },
  purge: {
    layers: ['utilities'],
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
  },
  theme: {
  },
  variants: {
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
