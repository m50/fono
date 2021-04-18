const babelConf = require('./config/.babelrc.json');
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
    '**/*.snap.tsx',
    '**/*.spec.tsx',
    '**/*.test.tsx',
    '**/*.snap.ts',
    '**/*.spec.ts',
    '**/*.test.ts',
  ],
  alias: {
    hooks: './src/hooks',
    components: './src/components',
    lib: './src/lib',
    pages: './src/pages',
    '@types': './src/@types',
  },
};
