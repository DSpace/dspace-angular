import { commonExports } from './webpack.common';
import { buildRoot, projectRoot } from './helpers';

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = Object.assign({}, commonExports, {
  plugins: [
    ...commonExports.plugins,
    new webpack.EnvironmentPlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        AOT: true
      }
    }),
  ],
  mode: 'production',
  recordsOutputPath: projectRoot('webpack.records.json'),
  entry: buildRoot('./main.server.ts'),
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
});
