import { environment } from '../src/environments/environment';

import * as child from 'child_process';

child.spawn(
  `ng serve --host ${environment.ui.host} --port ${environment.ui.port} --servePath ${environment.ui.nameSpace} --ssl ${environment.ui.ssl}`,
  { stdio:'inherit', shell: true }
);
