import path from 'path';
import {defineConfig} from 'vite';
import solidPlugin from 'vite-plugin-solid';
import WindiCSS from 'vite-plugin-windicss';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: 'src',
        replacement: path.join(process.cwd(), 'src'),
      },
    ],
  },
  plugins: [solidPlugin(), WindiCSS()],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
});
