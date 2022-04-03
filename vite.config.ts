import path from 'path';
import {defineConfig} from 'vite';
import solidPlugin from 'vite-plugin-solid';
import WindiCSS from 'vite-plugin-windicss';
import solidSvg from './vite/plugins/svg';

export default defineConfig({
  resolve: {
    alias: {
      src: path.join(process.cwd(), 'src'),
    },
  },
  plugins: [solidPlugin(), solidSvg(), WindiCSS()],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
});
