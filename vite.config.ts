import path from 'path';
import {defineConfig} from 'vite';
import solidPlugin from 'vite-plugin-solid';
import solidSvg from 'vite-plugin-solid-svg';
import WindiCSS from 'vite-plugin-windicss';

export default defineConfig({
  resolve: {
    alias: {
      src: path.join(process.cwd(), 'src'),
    },
    // [
    //   {
    //     find: 'src',
    //     replacement: path.join(process.cwd(), 'src'),
    //   },
    // ],
  },
  plugins: [solidPlugin(), WindiCSS(), solidSvg()],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
});
