import {
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
}

export const info: DSpaceESLintRuleInfo = {
  name: 'alias-imports',
  meta: {
    docs: {
      description: 'Unclear imports should be aliased for clarity',
    },
    messages: {
      [Message.NO_ALIAS]: 'This import must be aliased',
      [Message.WRONG_ALIAS]: 'This import uses the wrong alias (should be {{ local }})',
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
    return options[0].reduce((selectors: any, option: any) => {
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
 * @param option The current `defaultOptions` that needs to be handled
 * @param node The incorrect import node that should be fixed
 */
function handleUnaliasedImport(context: TSESLint.RuleContext<Message, unknown[]>, option: any, node: TSESTree.ImportSpecifier): void {
  if (node.local.name === node.imported.name) {
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
