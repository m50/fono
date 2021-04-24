const snowpackConfig = require('../snowpack.config.js');
const webpack = require('webpack');

module.exports = {
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  webpackFinal: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...snowpackConfig.alias,
    };

    config.module.rules.push({
      test: /\.[tj]sx?$/,
      loader: [
        require.resolve('@open-wc/webpack-import-meta-loader'),
        require.resolve(
          '@snowpack/plugin-webpack/plugins/proxy-import-resolve'
        ),
      ],
    });

    config.plugins.push(
      new webpack.DefinePlugin({
        __SNOWPACK_ENV__: JSON.stringify(process.env),
      })
    );

    return config;
  },
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    {
      name: "@storybook/addon-postcss",
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
  ]
}
