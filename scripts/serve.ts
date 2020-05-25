import { environment } from '../src/environments/environment';

import * as child from 'child_process';

/**
 * Calls `ng serve` with the following arguments configured for the UI in the environment file: host, port, nameSpace, ssl
 */
child.spawn(
  `ng serve --host ${environment.ui.host} --port ${environment.ui.port} --servePath ${environment.ui.nameSpace} --ssl ${environment.ui.ssl}`,
  { stdio:'inherit', shell: true }
);
