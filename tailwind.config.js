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
    plugin(({addUtilities, addComponents}) => {
      addComponents({
        '.input-focus': {
          color: '#000',
          // '&:focus': {
          //   boxShadow: 'rgb(39 104 165) 0px 0px 0px 1px',
          // },
        },
      });
      // const newUtilities = {
      //   '.fixed-center': {
      //     //
      //   },
      // };
      // addUtilities(newUtilities);
    }),
  ],
});
