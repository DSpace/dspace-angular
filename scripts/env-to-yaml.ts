import {
  existsSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

import { dump } from 'js-yaml';

/**
 * Script to help convert previous version environment.*.ts to yaml.
 *
 * Usage (see package.json):
 *
 * yarn env:yaml [relative path to environment.ts file] (optional relative path to write yaml file) *
 */

const args = process.argv.slice(2);
if (args[0] === undefined) {
  console.log(`Usage:\n\tyarn env:yaml [relative path to environment.ts file] (optional relative path to write yaml file)\n`);
  process.exit(0);
}

const envFullPath = join(process.cwd(), args[0]);

if (!existsSync(envFullPath)) {
  console.error(`Error:\n${envFullPath} does not exist\n`);
  process.exit(1);
}

try {
  const env = require(envFullPath).environment;

  const config = dump(env);
  if (args[1]) {
    const ymlFullPath = join(process.cwd(), args[1]);
    writeFileSync(ymlFullPath, config);
  } else {
    console.log(config);
  }
} catch (e) {
  console.error(e);
}

