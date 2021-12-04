import * as child from 'child_process';

import { environment } from '../src/environments/environment';

// import { AppConfig } from '../src/config/app-config.interface';
// import { buildAppConfig } from '../src/config/config.server';

// const appConfig: AppConfig = buildAppConfig();

/**
 * Calls `ng serve` with the following arguments configured for the UI in the environment: host, port, nameSpace, ssl
 */
child.spawn(
  `ng serve --host ${environment.ui.host} --port ${environment.ui.port} --serve-path ${environment.ui.nameSpace} --ssl ${environment.ui.ssl}`,
  { stdio:'inherit', shell: true }
);
