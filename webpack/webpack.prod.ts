import { EnvironmentPlugin } from 'webpack';

import { projectRoot } from './helpers';
import { commonExports } from './webpack.common';

module.exports = Object.assign({}, commonExports, {
  plugins: [
    ...commonExports.plugins,
    // @ts-expect-error: EnvironmentPlugin constructor types are currently to strict see issue https://github.com/webpack/webpack/issues/18719
    new EnvironmentPlugin({
      'process.env': {
        NODE_ENV: 'production',
        AOT: true,
      },
    }),
  ],
  mode: 'production',
  recordsOutputPath: projectRoot('webpack.records.json'),
  entry: projectRoot('./server.ts'),
  target: 'node',
});
