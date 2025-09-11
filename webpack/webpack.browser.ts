import { join } from 'path';

import { commonExports } from './webpack.common';

import { buildAppConfig } from '../src/config/config.server';
const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require('zlib');

module.exports = Object.assign({}, commonExports, {
  target: 'web',
  // // Tell webpack not to polyfill Node's modules (only needed for buildAppConfig,
  // // which runs on the command line, not the browser)
  // resolve: {
  //   fallback: {
  //     "os": false,
  //     "util": false
  //   },
  // },
  plugins: [
    ...commonExports.plugins,
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg|json)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg|json)$/,
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        },
      },
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
  devServer: {
    setupMiddlewares(middlewares, server) {
      buildAppConfig(join(process.cwd(), 'src/assets/config.json'));
      return middlewares;
    },
  },
  watchOptions: {
    // Ignore directories that should not be watched for recompiling angular
    ignored: [
      '**/node_modules', '**/_build', '**/.git', '**/docker',
      '**/.angular', '**/.idea', '**/.vscode', '**/.history', '**/.vsix',
    ],
  },
});
