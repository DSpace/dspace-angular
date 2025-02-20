import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';

import { AppConfig } from '../src/app/core/config/app-config.interface';
import { buildAppConfig } from '../src/config/config.server';

/**
 * Script to set baseHref as `ui.nameSpace` for development mode. Adds `baseHref` to angular.json build options.
 *
 * Usage (see package.json):
 *
 * yarn base-href
 */

const appConfig: AppConfig = buildAppConfig();

const projectJsonPath = join(process.cwd(), 'project.json');

if (!existsSync(projectJsonPath)) {
  console.error(`Error:\n${projectJsonPath} does not exist\n`);
  process.exit(1);
}

try {
  const projectJson = require(projectJsonPath);

  const baseHref = `${appConfig.ui.nameSpace}${appConfig.ui.nameSpace.endsWith('/') ? '' : '/'}`;

  console.log(`Setting baseHref to ${baseHref} in projects.json`);

  projectJson.targets.build.options.baseHref = baseHref;

  writeFileSync(projectJsonPath, JSON.stringify(projectJson, null, 2) + '\n');
} catch (e) {
  console.error(e);
}
