/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { RuleTester } from '@typescript-eslint/rule-tester';

import { themeableComponents } from '../src/util/theme-support';
import {
  FIXTURE,
  fixture,
} from './fixture';


// Register themed components from test fixture
themeableComponents.initialize(FIXTURE);

RuleTester.itOnly = fit;
RuleTester.itSkip = xit;

export const tsRuleTester = new RuleTester({
  defaultFilenames: {
    ts: fixture('src/test.ts'),
    tsx: 'n/a',
  },
  languageOptions: {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      project: fixture('tsconfig.json'),
    },
  },
});

class HtmlRuleTester extends RuleTester {
  run(name: string, rule: any, tests: { valid: any[], invalid: any[] }) {
    super.run(name, rule, {
      valid: tests.valid.map((test) => ({
        filename: fixture('test.html'),
        ...test,
      })),
      invalid: tests.invalid.map((test) => ({
        filename: fixture('test.html'),
        ...test,
      })),
    });
  }
}

export const htmlRuleTester = new HtmlRuleTester({
  languageOptions: {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    parser: require('@angular-eslint/template-parser'),
  },
});
