/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { default as htmlPlugin } from '../src/rules/html';
import { default as tsPlugin } from '../src/rules/ts';
import {
  htmlRuleTester,
  tsRuleTester,
} from './testing';

describe('TypeScript rules', () => {
  for (const { info, rule, tests } of tsPlugin.index) {
    tsRuleTester.run(info.name, rule, tests as any);
  }
});

describe('HTML rules', () => {
  for (const { info, rule, tests } of htmlPlugin.index) {
    htmlRuleTester.run(info.name, rule, tests);
  }
});
