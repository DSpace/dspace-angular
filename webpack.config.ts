const webpackMerge = require('webpack-merge');
const commonPartial = require('./webpack/webpack.common');
const clientPartial = require('./webpack/webpack.client');
const serverPartial = require('./webpack/webpack.server');
const prodPartial = require('./webpack/webpack.prod');

const {
  AotPlugin
} = require('@ngtools/webpack');

const {
  root
} = require('./webpack/helpers');

module.exports = function(options, webpackOptions) {
  options = options || {};

  if (options.aot) {
    console.log(`Running build for ${options.client ? 'client' : 'server'} with AoT Compilation`)
  }

  let serverConfig = webpackMerge({}, commonPartial, serverPartial, {
    entry: options.aot ? './src/main.server.aot.ts' : serverPartial.entry, // Temporary
    plugins: [
      new AotPlugin({
        tsConfigPath: root(options.aot ? './src/tsconfig.server.aot.json' : './src/tsconfig.server.json'),
        skipCodeGeneration: !options.aot
      })
    ]
  });

  let clientConfig = webpackMerge({}, commonPartial, clientPartial, {
    plugins: [
      new AotPlugin({
        tsConfigPath: root('./src/tsconfig.browser.json'),
        skipCodeGeneration: !options.aot
      })
    ]
  });

  if (webpackOptions.p) {
    serverConfig = webpackMerge({}, serverConfig, prodPartial);
    clientConfig = webpackMerge({}, clientConfig, prodPartial);
  }

  const configs = [];

  if (!options.aot) {
    configs.push(clientConfig, serverConfig);
  } else if (options.client) {
    configs.push(clientConfig);
  } else if (options.server) {
    configs.push(serverConfig);
  }

  return configs;
}
