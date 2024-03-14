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
export type Valid = RuleTester.ValidTestCase | TSESLint.ValidTestCase<unknown[]>;
export type Invalid = RuleTester.InvalidTestCase | TSESLint.InvalidTestCase<string, unknown[]>;


export interface DSpaceESLintRuleInfo {
  name: string;
  meta: Meta,
  defaultOptions: any[],
}

export interface DSpaceESLintTestInfo {
  rule: string;
  valid: Valid[];
  invalid: Invalid[];
}

export interface DSpaceESLintPluginInfo {
  name: string;
  description: string;
  rules: DSpaceESLintRuleInfo;
  tests: DSpaceESLintTestInfo;
}

export interface DSpaceESLintInfo {
  html: DSpaceESLintPluginInfo;
  ts: DSpaceESLintPluginInfo;
}

export interface RuleExports {
  Message: EnumType,
  info: DSpaceESLintRuleInfo,
  rule: any,
  tests: any,
  default: any,
}

export function bundle(
  name: string,
  language: string,
  index: RuleExports[],
): {
  name: string,
  language: string,
  rules: Record<string, any>,
  index: RuleExports[],
} {
  return index.reduce((o: any, i: any) => {
    o.rules[i.info.name] = i.rule;
    return o;
  }, {
    name,
    language,
    rules: {},
    index,
  });
}
