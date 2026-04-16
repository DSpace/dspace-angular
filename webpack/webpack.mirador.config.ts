const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('node:path');
// @ts-ignore
const fs = require('node:fs');

module.exports = {
  mode: 'production',
  entry: {
    mirador: fs.existsSync('./src/mirador-viewer/config.local.js') ? './src/mirador-viewer/config.local.js' :
      './src/mirador-viewer/config.default.js',
  },
  output: {
    path: path.resolve(__dirname, '..' , 'dist/iiif/mirador'),
    filename: '[name].js',
  },
  devServer: {
    contentBase: '../dist/iiif/mirador',
  },
  resolve: {
    fallback: {
      url: false,
    } },
  plugins: [new CopyWebpackPlugin({
    patterns: [
      { from: './src/mirador-viewer/mirador.html', to: './index.html' },
    ],
  })],
};
