var nodeExternals = require('webpack-node-externals');

const {
  root
} = require('./helpers');

module.exports = {
  getServerWebpackPartial: function (aot) {
    const entry = aot ? root('./src/main.server.aot.ts') : root('./src/main.server.ts');
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
      	  /angular-sortablejs/,
      	  /sortablejs/,
          /ngx/]
      })],
    }
  }
};
