import { loadEnvInto } from '@dspace/config/env.config';
import { spawn } from 'child_process';
import { environment } from 'src/environments/environment';

loadEnvInto(environment);

/**
 * Calls `ng serve` with the following arguments configured for the UI in the app config: host, port, nameSpace, ssl
 * Any CLI arguments given to this script are patched through to `ng serve` as well.
 */
spawn(
  `ng serve --host ${environment.ui.host} --port ${environment.ui.port} --serve-path ${environment.ui.nameSpace} --ssl ${environment.ui.ssl} ${process.argv.slice(2).join(' ')} --configuration development`,
  { stdio: 'inherit', shell: true }
);
