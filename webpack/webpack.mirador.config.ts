const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
// @ts-ignore
const fs = require('fs');

module.exports = {
  mode: 'production',
  entry: {
    mirador: fs.existsSync('./src/mirador-viewer/config.local.js')? './src/mirador-viewer/config.local.js' :
      './src/mirador-viewer/config.default.js'
  },
  output: {
    path: path.resolve(__dirname, '..' , 'dist/iiif/mirador'),
    filename: '[name].js'
  },
  devServer: {
    contentBase: '../dist/iiif/mirador',
  },
  resolve: {
    fallback: {
      url: false
    }},
  plugins: [new CopyWebpackPlugin({
    patterns: [
      {from: './src/mirador-viewer/mirador.html', to: './index.html'}
    ]
  })]
};
