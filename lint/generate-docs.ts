/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';

import { default as htmlPlugin } from './src/rules/html';
import { default as tsPlugin } from './src/rules/ts';

const templates = new Map();

function lazyEJS(path: string, data: object): string {
  if (!templates.has(path)) {
    templates.set(path, require('ejs').compile(readFileSync(path).toString()));
  }

  return templates.get(path)(data).replace(/\r\n/g, '\n');
}

const docsDir = join('docs', 'lint');
const tsDir = join(docsDir, 'ts');
const htmlDir = join(docsDir, 'html');

if (existsSync(docsDir)) {
  rmSync(docsDir, { recursive: true });
}

mkdirSync(join(tsDir, 'rules'), { recursive: true });
mkdirSync(join(htmlDir, 'rules'), { recursive: true });

function template(name: string): string {
  return join('lint', 'src', 'util', 'templates', name);
}

// TypeScript docs
writeFileSync(
  join(tsDir, 'index.md'),
  lazyEJS(template('index.ejs'), {
    plugin: tsPlugin,
    rules: tsPlugin.index.map(rule => rule.info),
  }),
);

for (const rule of tsPlugin.index) {
  writeFileSync(
    join(tsDir, 'rules', rule.info.name + '.md'),
    lazyEJS(template('rule.ejs'), {
      plugin: tsPlugin,
      rule: rule.info,
      tests: rule.tests,
    }),
  );
}

// HTML docs
writeFileSync(
  join(htmlDir, 'index.md'),
  lazyEJS(template('index.ejs'), {
    plugin: htmlPlugin,
    rules: htmlPlugin.index.map(rule => rule.info),
  }),
);

for (const rule of htmlPlugin.index) {
  writeFileSync(
    join(htmlDir, 'rules', rule.info.name + '.md'),
    lazyEJS(template('rule.ejs'), {
      plugin: htmlPlugin,
      rule: rule.info,
      tests: rule.tests,
    }),
  );
}

