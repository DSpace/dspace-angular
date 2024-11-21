/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { TSESLint } from '@typescript-eslint/utils';
import { RuleTester } from 'eslint';
import { EnumType } from 'typescript';

export type Meta = TSESLint.RuleMetaData<string>;
export type Valid = TSESLint.ValidTestCase<unknown[]> | RuleTester.ValidTestCase;
export type Invalid = TSESLint.InvalidTestCase<string, unknown[]> | RuleTester.InvalidTestCase;

export interface DSpaceESLintRuleInfo {
  name: string;
  meta: Meta,
  defaultOptions: unknown[],
}

export interface NamedTests {
  plugin: string;
  valid: Valid[];
  invalid: Invalid[];
}

export interface RuleExports {
  Message: EnumType,
  info: DSpaceESLintRuleInfo,
  rule: TSESLint.RuleModule<string>,
  tests: NamedTests,
  default: unknown,
}

export interface PluginExports {
  name: string,
  language: string,
  rules: Record<string, unknown>,
  index: RuleExports[],
}

export function bundle(
  name: string,
  language: string,
  index: RuleExports[],
): PluginExports {
  return index.reduce((o: PluginExports, i: RuleExports) => {
    o.rules[i.info.name] = i.rule;
    return o;
  }, {
    name,
    language,
    rules: {},
    index,
  });
}
