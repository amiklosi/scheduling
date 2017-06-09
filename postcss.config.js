module.exports = {
  plugins: {
    'postcss-import': {
      root: __dirname,
    },
    'postcss-mixins': {},
    'postcss-each': {},
    'postcss-cssnext': {
      features: {
        customProperties: {
          variables: {
            'button-primary-color': '#333',
            'color-primary': '#fff',
            'color-text' : 'green'
          }
        }
      }
    }
  },
};
