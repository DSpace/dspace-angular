/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import {
  InvalidTestCase,
  RuleMetaData,
  RuleModule,
  ValidTestCase,
} from '@typescript-eslint/utils/ts-eslint';
import { EnumType } from 'typescript';

export type Meta = RuleMetaData<string, unknown[]>;
export type Valid = ValidTestCase<unknown[]>;
export type Invalid = InvalidTestCase<string, unknown[]>;

export interface DSpaceESLintRuleInfo<T = unknown[], D = unknown[]> {
  name: string;
  meta: Meta,
  optionDocs: D,
  defaultOptions: T,
}

export interface OptionDoc {
  title: string;
  description: string;
}

export interface NamedTests {
  plugin: string;
  valid: Valid[];
  invalid: Invalid[];
}

export interface RuleExports {
  Message: EnumType,
  info: DSpaceESLintRuleInfo,
  rule: RuleModule<string>,
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
