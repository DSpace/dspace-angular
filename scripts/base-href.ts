import {
  existsSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

import { loadEnvInto } from '@dspace/config/env.config';
import { environment } from 'src/environments/environment';

/**
 * Script to set baseHref as `ui.nameSpace` for development mode. Adds `baseHref` to angular.json build options.
 *
 * Usage (see package.json):
 *
 * yarn base-href
 */

loadEnvInto(environment);

const angularJsonPath = join(process.cwd(), 'angular.json');

if (!existsSync(angularJsonPath)) {
  console.error(`Error:\n${angularJsonPath} does not exist\n`);
  process.exit(1);
}

try {
  const angularJson = JSON.parse(readFileSync(angularJsonPath, 'utf8'));

  const baseHref = `${environment.ui.nameSpace}${environment.ui.nameSpace.endsWith('/') ? '' : '/'}`;

  console.log(`Setting baseHref to ${baseHref} in angular.json`);

  angularJson.projects['dspace-angular'].architect.build.options.baseHref = baseHref;

  writeFileSync(angularJsonPath, JSON.stringify(angularJson, null, 2) + '\n');
} catch (e) {
  console.error(e);
}
