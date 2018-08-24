const webpackMerge = require('webpack-merge');
const commonPartial = require('./webpack/webpack.common');
const clientPartial = require('./webpack/webpack.client');
const { getServerWebpackPartial } = require('./webpack/webpack.server');
const prodPartial = require('./webpack/webpack.prod');

const {
  getAotPlugin
} = require('./webpack/webpack.aot');

module.exports = function(options) {
  options = options || {};
  if (options.aot) {
    console.log(`Running build for ${options.client ? 'client' : 'server'} with AoT Compilation`)
  }

  let serverPartial = getServerWebpackPartial(options.aot);

  let serverConfig = webpackMerge({}, commonPartial, serverPartial, {
    plugins: [
      getAotPlugin('server', !!options.aot)
    ]
  });

  let clientConfig = webpackMerge({}, commonPartial, clientPartial, {
    plugins: [
      getAotPlugin('client', !!options.aot)
    ]
  });

  if (options.mode === 'production') {
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
