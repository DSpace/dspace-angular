var nodeExternals = require('webpack-node-externals');

const {
    buildRoot
} = require('./helpers');

module.exports = (env) => {
  return {
    getServerWebpackPartial: function (aot) {
      const entry = aot ? buildRoot('./main.server.aot.ts', env) : buildRoot('./main.server.ts', env);
      return {
        entry: entry,
        output: {
          filename: 'server.js'
        },
        target: 'node',
        externals: [nodeExternals({
          whitelist: [
            /@angular/,
            /@ng/,
            /angular2-text-mask/,
            /ng2-file-upload/,
            /ngx-sortablejs/,
            /sortablejs/,
            /ngx/]
        })],
      }
    }
  }
};
