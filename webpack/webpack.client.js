const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtPlugin = require('script-ext-html-webpack-plugin');

const {
  projectRoot,
  buildRoot
} = require('./helpers');

module.exports = (env) => {
  return {
    entry: buildRoot('./main.browser.ts', env),
    output: {
      filename: 'client.js'
    },
    target: 'web',
    plugins: [
      new HtmlWebpackPlugin({
        template: buildRoot('./index.html', env),
        output: projectRoot('dist'),
        inject: 'head'
      }),
      new ScriptExtPlugin({
        defaultAttribute: 'defer'
      })
    ]
  };
}
