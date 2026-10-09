import { EnvironmentPlugin } from 'webpack';

import { projectRoot } from './helpers';
import { commonExports } from './webpack.common';

const SSR_DEBUG = process.env.SSR_DEBUG === 'true';

module.exports = Object.assign({}, commonExports, {
  plugins: [
    ...commonExports.plugins,
    new EnvironmentPlugin({
      'process.env': {
        NODE_ENV: 'production',
        AOT: true,
      },
    }),
  ],
  mode: 'production',
  optimization: {
    minimize: !SSR_DEBUG,
  },
  recordsOutputPath: projectRoot('webpack.records.json'),
  entry: projectRoot('./server.ts'),
  target: 'node',
});
