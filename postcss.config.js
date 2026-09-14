module.exports = {
  plugins: [
    require('postcss-import')(),
    require('postcss-preset-env')({
      features: {
        'has-pseudo-class': false
      }
    })
  ]
};
