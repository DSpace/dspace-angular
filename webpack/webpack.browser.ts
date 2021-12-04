import { buildAppConfig } from '../src/config/config';
import { commonExports } from './webpack.common';
import { join } from 'path';

module.exports = Object.assign({}, commonExports, {
  target: 'web',
  node: {
    module: 'empty'
  },
  devServer: {
    before(app, server) {
      buildAppConfig(join(process.cwd(), 'src/assets/appConfig.json'));
    }
 }
});
