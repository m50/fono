require('./prepare');

const { NODE_ENV, CONTEXT } = process.env;

module.exports = {
  target: 'experimental-serverless-trace',
  productionBrowserSourceMaps: NODE_ENV === 'production',
  env: {
    CONTEXT,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      loader: 'frontmatter-markdown-loader',
      options: { mode: ['react-component'] },
    });

    return config;
  },
  rewrites: async () => [
    { source: '/r/:path*', destination: '/api/:path*' },
  ],
  redirects: async () => [
  ],
};
