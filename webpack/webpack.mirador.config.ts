const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    mirador: './src/mirador-viewer/index.js'
  },
  output: {
    path: path.resolve(__dirname, '..' , 'dist/iiif/mirador'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
  },
  devServer: {
    contentBase: '../dist/iiif/mirador',
  },
  plugins: [new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './src/mirador-viewer/mirador.html'
  })]
};
