import { join } from 'path';

import { buildAppConfig } from '../src/config/config.server';
import { commonExports } from './webpack.common';

module.exports = Object.assign({}, commonExports, {
  target: 'web',
  node: {
    module: 'empty'
  },
  devServer: {
    disableHostCheck: true,
    before(app, server) {
      buildAppConfig(join(process.cwd(), 'src/assets/config.json'));

      app.use('/', function (req, res,next) {
        console.log(`from ${req.ip} - ${req.method} - ${req.originalUrl}`);
        next();
      });

    }
 }
});
