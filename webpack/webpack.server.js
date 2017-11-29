var nodeExternals = require('webpack-node-externals');

const {
  root
} = require('./helpers');

module.exports = {
  entry: root('./src/main.server.ts'),
  output: {
    filename: 'server.js'
  },
  target: 'node',
  watchOptions: {
    ignored: [/node_modules/, /dist/]
  },
  externals: [nodeExternals({
    whitelist: [
      /@angular/,
      /@ng/,
      /angular2-text-mask/,
      /ng2-file-upload/,
      /ngx/]
  })],
};
