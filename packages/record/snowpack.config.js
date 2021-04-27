const babelConf = require('./package.json').babel;
const { join } = require('path');

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  workspaceRoot: '../../',
  env: process.env,
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-typescript',
    '@snowpack/plugin-postcss',
    ['@snowpack/plugin-babel', { transformOptions: babelConf }],
    '@jadex/snowpack-plugin-tailwindcss-jit',
  ],
  optimize: {
    bundle: process.env.NODE_ENV === 'production',
    minify: process.env.NODE_ENV === 'production',
    target: 'es2020',
    treeshake: true,
    splitting: true,
    sourcemap: true,
    manifest: true,
  },
  routes: [
    { match: 'routes', src: '.*', dest: '/index.html' },
  ],
  packageOptions: {
    types: true,
    polyfillNode: true
  },
  devOptions: {
    hmr: true,
    hmrPort: 80,
    port: 3000,
  },
  buildOptions: {
    out: 'dist',
    sourcemap: true,
  },
  exclude: [
    '**/node_modules/**/*',
    '**/*.stories.tsx',
    '**/*.stories.mdx',
    '**/*.snap.tsx',
    '**/*.spec.tsx',
    '**/*.test.tsx',
    '**/*.snap.ts',
    '**/*.spec.ts',
    '**/*.test.ts',
  ],
  alias: {
    hooks: join(__dirname, 'src', 'hooks'),
    components: join(__dirname, 'src', 'components'),
    templates: join(__dirname, 'src', 'templates'),
    constants: join(__dirname, 'src', 'constants'),
    lib: join(__dirname, 'src', 'lib'),
    pages: join(__dirname, 'src', 'pages'),
    '@types': join(__dirname, 'src', '@types'),
  },
};
