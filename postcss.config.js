module.exports = {
  plugins: [
    require('postcss-import')(),
    require('postcss-cssnext')(),
    require('postcss-apply')(),
    require('postcss-responsive-type')()
  ]
};
