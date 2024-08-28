import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESLint,
  TSESTree,
} from '@typescript-eslint/utils';

import {
  DSpaceESLintRuleInfo,
  NamedTests,
} from '../../util/structure';

export enum Message {
  NO_ALIAS = 'noAlias',
  WRONG_ALIAS = 'wrongAlias',
  MULTIPLE_ALIASES = 'multipleAliases',
}

interface AliasImportOption {
  package: string;
  imported: string;
  local: string;
}

export const info: DSpaceESLintRuleInfo<[[AliasImportOption]]> = {
  name: 'alias-imports',
  meta: {
    docs: {
      description: 'Unclear imports should be aliased for clarity',
    },
    messages: {
      [Message.NO_ALIAS]: 'This import must be aliased',
      [Message.WRONG_ALIAS]: 'This import uses the wrong alias (should be {{ local }})',
      [Message.MULTIPLE_ALIASES]: 'This import was used twice with a different alias (should be {{ local }})',
    },
    fixable: 'code',
    type: 'problem',
    schema: [
      {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            package: { type: 'string' },
            imported: { type: 'string' },
            local: { type: 'string' },
          },
        },
      },
    ],
  },
  defaultOptions: [
    [
      {
        package: 'rxjs',
        imported: 'of',
        local: 'observableOf',
      },
    ],
  ],
};

export const rule = ESLintUtils.RuleCreator.withoutDocs({
  ...info,
  create(context: TSESLint.RuleContext<Message, unknown[]>, options: any) {
    return options[0].reduce((selectors: any, option: AliasImportOption) => {
      selectors[`ImportDeclaration[source.value = "${option.package}"] > ImportSpecifier[imported.name = "${option.imported}"][local.name != "${option.local}"]`] = (node: TSESTree.ImportSpecifier) => handleUnaliasedImport(context, option, node);
      return selectors;
    }, {});
  },
});

export const tests: NamedTests = {
  plugin: info.name,
  valid: [
    {
      name: 'correctly aliased imports',
      code: `
import { of as observableOf } from 'rxjs';
        `,
    },
  ],
  invalid: [
    {
      name: 'imports without alias',
      code: `
import { of } from 'rxjs';
        `,
      errors: [
        {
          messageId: 'noAlias',
        },
      ],
      output: `
import { of as observableOf } from 'rxjs';
        `,
    },
    {
      name: 'imports under the wrong alias',
      code: `
import { of as ofSomething } from 'rxjs';
        `,
      errors: [
        {
          messageId: 'wrongAlias',
        },
      ],
      output: `
import { of as observableOf } from 'rxjs';
        `,
    },
  ],
};

/**
 * Replaces the incorrectly aliased imports with the ones defined in the defaultOptions
 *
 * @param context The current {@link TSESLint.RuleContext}
 * @param option The current {@link AliasImportOption} that needs to be handled
 * @param node The incorrect import node that should be fixed
 */
function handleUnaliasedImport(context: TSESLint.RuleContext<Message, unknown[]>, option: AliasImportOption, node: TSESTree.ImportSpecifier): void {
  const hasAliasedImport: boolean = (node.parent as TSESTree.ImportDeclaration).specifiers.find((specifier: TSESTree.ImportClause) => specifier.local.name === option.local && specifier.type === AST_NODE_TYPES.ImportSpecifier && (specifier as TSESTree.ImportSpecifier).imported.name === option.imported) !== undefined;

  if (hasAliasedImport) {
    context.report({
      messageId: Message.MULTIPLE_ALIASES,
      node: node,
      fix(fixer: TSESLint.RuleFixer) {
        const commaAfter = context.sourceCode.getTokenAfter(node, {
          filter: (token: TSESTree.Token) => token.value === ',',
        });
        if (commaAfter) {
          return fixer.removeRange([node.range[0], commaAfter.range[1]]);
        } else {
          return fixer.remove(node);
        }
      },
    });
  } else if (node.local.name === node.imported.name) {
    context.report({
      messageId: Message.NO_ALIAS,
      node: node,
      fix(fixer: TSESLint.RuleFixer) {
        return fixer.replaceText(node.local, `${option.imported} as ${option.local}`);
      },
    });
  } else {
    context.report({
      messageId: Message.WRONG_ALIAS,
      data: { local: option.local },
      node: node,
      fix(fixer: TSESLint.RuleFixer) {
        return fixer.replaceText(node.local, option.local);
      },
    });
  }
}
