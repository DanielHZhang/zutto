const {defineConfig} = require('vite-plugin-windicss');

/** @type {import('windicss/types/interfaces').PluginBuilder} */
const plugin = require('windicss/plugin');

module.exports = defineConfig({
  darkMode: 'class',
  theme: {
    extend: {},
  },
  // plugins: [
  //   plugin(({addUtilities}) => {
  //     const newUtilities = {
  //       '.fixed-center': {
  //         //
  //       },
  //     };
  //     addUtilities(newUtilities);
  //   }),
  // ],
});
