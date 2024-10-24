/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { RuleMetaData } from '@typescript-eslint/utils/ts-eslint';

import { default as html } from '../src/rules/html';
import { default as ts } from '../src/rules/ts';

describe('plugin structure', () => {
  for (const pluginExports of [ts, html]) {
    const pluginName = pluginExports.name ?? 'UNNAMED PLUGIN';

    describe(pluginName, () => {
      it('should have a name', () => {
        expect(pluginExports.name).toBeTruthy();
      });

      it('should have rules', () => {
        expect(pluginExports.index).toBeTruthy();
        expect(pluginExports.rules).toBeTruthy();
        expect(pluginExports.index.length).toBeGreaterThan(0);
      });

      for (const ruleExports of pluginExports.index) {
        const ruleName = ruleExports.info.name ?? 'UNNAMED RULE';

        describe(ruleName, () => {
          it('should have a name', () => {
            expect(ruleExports.info.name).toBeTruthy();
          });

          it('should be included under the right name in the plugin', () => {
            expect(pluginExports.rules[ruleExports.info.name]).toBe(ruleExports.rule);
          });

          it('should contain metadata', () => {
            expect(ruleExports.info).toBeTruthy();
            expect(ruleExports.info.name).toBeTruthy();
            expect(ruleExports.info.meta).toBeTruthy();
            expect(ruleExports.info.defaultOptions).toBeTruthy();
          });

          it('should contain messages', () => {
            expect(ruleExports.Message).toBeTruthy();
            expect(ruleExports.info.meta.messages).toBeTruthy();
          });

          describe('messages', () => {
            for (const member of Object.keys(ruleExports.Message)) {
              describe(member, () => {
                const id = (ruleExports.Message as any)[member];

                it('should have a valid ID', () => {
                  expect(id).toBeTruthy();
                });

                it('should have valid metadata', () => {
                  expect(ruleExports.info.meta.messages[id]).toBeTruthy();
                });
              });
            }
          });

          it('should contain tests', () => {
            expect(ruleExports.tests).toBeTruthy();
            expect(ruleExports.tests.valid.length).toBeGreaterThan(0);
            expect(ruleExports.tests.invalid.length).toBeGreaterThan(0);
          });

          it('should contain a valid ESLint rule', () => {
            // we don't have a better way to enforce this, but it's something at least
            expect((ruleExports.rule as any).name).toBeUndefined(
              'Rules should be passed to RuleCreator, omitting info.name since it is not part of the RuleWithMeta interface',
            );

            expect(ruleExports.rule.create).toBeTruthy();
            expect(ruleExports.rule.meta).toEqual(ruleExports.info.meta as RuleMetaData<string, []>);
          });
        });
      }
    });
  }
});
