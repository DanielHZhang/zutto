const {defineConfig} = require('vite-plugin-windicss');
const defaultTheme = require('windicss/defaultTheme');

/** @type {import('windicss/types/interfaces').PluginBuilder} */
const plugin = require('windicss/plugin');

module.exports = defineConfig({
  darkMode: 'class',
  theme: {
    screens: {
      xs: '360px',
      ...defaultTheme.screens,
    },
  },
  plugins: [
    plugin(({addBase, addComponents}) => {
      addBase({
        html: {
          minHeight: '100%',
        },
        body: {
          minHeight: '100%',
        },
      });

      addComponents({
        '.bg-app': {
          backgroundColor: '#1a212e',
        },
        '.bg-header': {
          backgroundColor: '#141b24',
        },
        '.bg-popover': {
          backgroundColor: '#111520ee',
        },
        '.bg-card': {
          backgroundColor: '#212a3f',
        },
        '.bg-hover': {
          backgroundColor: '#1a2950',
        },
        '.shadow-focus': {
          boxShadow: 'rgb(39 104 165) 0px 0px 0px 1px',
        },
        '.shadow-checkbox': {
          boxShadow: 'inset 0px 2px 3px rgba(0, 0, 0, 0.1)',
        },
      });
    }),
  ],
});
