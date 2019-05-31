const {
  buildRoot
} = require('./helpers');

const {
  AngularCompilerPlugin
} = require('@ngtools/webpack');

const tsconfigs = {
  client: buildRoot('./tsconfig.browser.json'),
  server: buildRoot('./tsconfig.server.json')
};

const aotTsconfigs = {
  client: buildRoot('./tsconfig.browser.json'),
  server: buildRoot('./tsconfig.server.aot.json')
};

/**
 * Generates a AotPlugin for @ngtools/webpack
 *
 * @param {string} platform Should either be client or server
 * @param {boolean} aot Enables/Disables AoT Compilation
 * @returns {AotPlugin} Configuration of AotPlugin
 */
function getAotPlugin(platform, aot) {
  return new AngularCompilerPlugin({
    tsConfigPath: aot ? aotTsconfigs[platform] : tsconfigs[platform],
    skipCodeGeneration: !aot
  });
}

module.exports = {
  getAotPlugin: getAotPlugin
};
