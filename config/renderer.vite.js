const { join } = require('path');
const reactRefresh = require('@vitejs/plugin-react-refresh');
const { chrome } = require('./electron-vendors');
/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
module.exports = {
  root: join(process.cwd(), './src/renderer'),
  resolve: {
    alias: {
      '/@/': join(process.cwd(), './src/renderer') + '/',
    },
  },
  plugins: [reactRefresh()],
  base: '',
  build: {
    sourcemap: 'inline',
    target: `chrome${chrome}`,
    polyfillDynamicImport: false,
    outDir: join(process.cwd(), 'dist/source/renderer'),
    assetsDir: '.',
    emptyOutDir: true,
  },
};
