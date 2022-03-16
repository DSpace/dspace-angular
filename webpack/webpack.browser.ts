import { join } from 'path';

import { buildAppConfig } from '../src/config/config.server';
import { commonExports } from './webpack.common';

module.exports = Object.assign({}, commonExports, {
  target: 'web',
  devServer: {
    setupMiddlewares(middlewares, server) {
      buildAppConfig(join(process.cwd(), 'src/assets/config.json'));
      return middlewares;
    }
 }
});
