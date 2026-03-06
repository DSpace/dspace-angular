import { EnvAppConfig } from '@dspace/config/config.env';
import { spawn } from 'child_process';

const appConfig = EnvAppConfig.loadEnv();

/**
 * Calls `ng serve` with the following arguments configured for the UI in the app config: host, port, nameSpace, ssl
 * Any CLI arguments given to this script are patched through to `ng serve` as well.
 */
spawn(
  `ng serve --host ${appConfig.ui.host} --port ${appConfig.ui.port} --serve-path ${appConfig.ui.nameSpace} --ssl ${appConfig.ui.ssl} ${process.argv.slice(2).join(' ')} --configuration development`,
  { stdio: 'inherit', shell: true }
);
