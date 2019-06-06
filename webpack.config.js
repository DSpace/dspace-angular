const webpackMerge = require('webpack-merge');
const commonPartial = require('./webpack/webpack.common');
const clientPartial = require('./webpack/webpack.client');
const { getServerWebpackPartial } = require('./webpack/webpack.server');
const prodPartial = require('./webpack/webpack.prod');

const {
  getAotPlugin
} = require('./webpack/webpack.aot');

module.exports = function(env, options) {
    env = env || {};
  if (env.aot) {
    console.log(`Running build for ${env.client ? 'client' : 'server'} with AoT Compilation`)
  }

  let serverPartial = getServerWebpackPartial(env.aot);

  let serverConfig = webpackMerge({}, commonPartial, serverPartial, {
    plugins: [
      getAotPlugin('server', !!env.aot)
    ]
  });

  let clientConfig = webpackMerge({}, commonPartial, clientPartial, {
    plugins: [
      getAotPlugin('client', !!env.aot)
    ]
  });
  if (options.mode === 'production') {
    serverConfig = webpackMerge({}, serverConfig, prodPartial);
    clientConfig = webpackMerge({}, clientConfig, prodPartial);
  }

  const configs = [];

  if (!env.aot) {
    configs.push(clientConfig, serverConfig);
  } else if (env.client) {
    configs.push(clientConfig);
  } else if (env.server) {
    configs.push(serverConfig);
  }

  return configs;
};
