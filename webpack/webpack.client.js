const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtPlugin = require('script-ext-html-webpack-plugin');

const {
  projectRoot,
  buildRoot
} = require('./helpers');

module.exports = {
  entry: buildRoot('./main.browser.ts'),
  output: {
    filename: 'client.js'
  },
  target: 'web',
  plugins: [
    new HtmlWebpackPlugin({
      template: buildRoot('./index.html'),
      output: projectRoot('dist'),
      inject: 'head'
    }),
    new ScriptExtPlugin({
      defaultAttribute: 'defer'
    })
  ]
};
