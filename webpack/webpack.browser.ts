import { join } from 'path';

import { buildAppConfig } from '../src/config/config.server';
import { commonExports } from './webpack.common';

module.exports = Object.assign({}, commonExports, {
  target: 'web',
  devServer: {
    before(app, server) {
      buildAppConfig(join(process.cwd(), 'src/assets/config.json'));
    }
 }
});
