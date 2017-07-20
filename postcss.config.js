module.exports = {
  plugins: [
    require('postcss-smart-import')(),
    require('postcss-cssnext')(),
    require('postcss-apply')(),
    require('postcss-responsive-type')()
  ]
};
