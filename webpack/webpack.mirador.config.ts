import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    mirador: existsSync('./src/mirador-viewer/config.local.js') ? './src/mirador-viewer/config.local.js' :
      './src/mirador-viewer/config.default.js',
  },
  output: {
    path: resolve(__dirname, '..' , 'dist/iiif/mirador'),
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
