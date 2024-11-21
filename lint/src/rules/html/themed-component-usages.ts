/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import { TemplateParserServices } from '@angular-eslint/utils';
import {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/utils';

import { fixture } from '../../../test/fixture';
import {
  DSpaceESLintRuleInfo,
  NamedTests,
} from '../../util/structure';
import {
  DISALLOWED_THEME_SELECTORS,
  fixSelectors,
} from '../../util/theme-support';
import {
  getFilename,
  getSourceCode,
} from '../../util/typescript';

export enum Message {
  WRONG_SELECTOR = 'mustUseThemedWrapperSelector',
}

export const info = {
  name: 'themed-component-usages',
  meta: {
    docs: {
      description: `Themeable components should be used via the selector of their \`ThemedComponent\` wrapper class

This ensures that custom themes can correctly override _all_ instances of this component.
The only exception to this rule are unit tests, where we may want to use the base component in order to keep the test setup simple.
      `,
    },
    type: 'problem',
    fixable: 'code',
    schema: [],
    messages: {
      [Message.WRONG_SELECTOR]: 'Themeable components should be used via their ThemedComponent wrapper\'s selector',
    },
  },
  defaultOptions: [],
} as DSpaceESLintRuleInfo;

export const rule = ESLintUtils.RuleCreator.withoutDocs({
  ...info,
  create(context: TSESLint.RuleContext<Message, unknown[]>) {
    if (getFilename(context).includes('.spec.ts')) {
      // skip inline templates in unit tests
      return {};
    }

    const parserServices = getSourceCode(context).parserServices as TemplateParserServices;

    return {
      [`Element$1[name = /^${DISALLOWED_THEME_SELECTORS}/]`](node: TmplAstElement) {
        const { startSourceSpan, endSourceSpan } = node;
        const openStart = startSourceSpan.start.offset as number;

        context.report({
          messageId: Message.WRONG_SELECTOR,
          loc: parserServices.convertNodeSourceSpanToLoc(startSourceSpan),
          fix(fixer) {
            const oldSelector = node.name;
            const newSelector = fixSelectors(oldSelector);

            const ops = [
              fixer.replaceTextRange([openStart + 1, openStart + 1 + oldSelector.length], newSelector),
            ];

            // make sure we don't mangle self-closing tags
            if (endSourceSpan !== null && startSourceSpan.end.offset !== endSourceSpan.end.offset) {
              const closeStart = endSourceSpan.start.offset as number;
              const closeEnd = endSourceSpan.end.offset as number;

              ops.push(fixer.replaceTextRange([closeStart + 2, closeEnd - 1], newSelector));
            }

            return ops;
          },
        });
      },
    };
  },
});

export const tests = {
  plugin: info.name,
  valid: [
    {
      name: 'use no-prefix selectors in HTML templates',
      code: `
<ds-test-themeable/>
<ds-test-themeable></ds-test-themeable>
<ds-test-themeable [test]="something"></ds-test-themeable>
        `,
    },
    {
      name: 'use no-prefix selectors in TypeScript templates',
      code: `
@Component({
  template: '<ds-test-themeable></ds-test-themeable>'
})
class Test {
}
        `,
    },
    {
      name: 'use no-prefix selectors in TypeScript test templates',
      filename: fixture('src/test.spec.ts'),
      code: `
@Component({
  template: '<ds-test-themeable></ds-test-themeable>'
})
class Test {
}
        `,
    },
    {
      name: 'base selectors are also allowed in TypeScript test templates',
      filename: fixture('src/test.spec.ts'),
      code: `
@Component({
  template: '<ds-base-test-themeable></ds-base-test-themeable>'
})
class Test {
}
        `,
    },
  ],
  invalid: [
    {
      name: 'themed override selectors are not allowed in HTML templates',
      code: `
<ds-themed-test-themeable/>
<ds-themed-test-themeable></ds-themed-test-themeable>
<ds-themed-test-themeable [test]="something"></ds-themed-test-themeable>
        `,
      errors: [
        {
          messageId: Message.WRONG_SELECTOR,
        },
        {
          messageId: Message.WRONG_SELECTOR,
        },
        {
          messageId: Message.WRONG_SELECTOR,
        },
      ],
      output: `
<ds-test-themeable/>
<ds-test-themeable></ds-test-themeable>
<ds-test-themeable [test]="something"></ds-test-themeable>
        `,
    },
    {
      name: 'base selectors are not allowed in HTML templates',
      code: `
<ds-base-test-themeable/>
<ds-base-test-themeable></ds-base-test-themeable>
<ds-base-test-themeable [test]="something"></ds-base-test-themeable>
        `,
      errors: [
        {
          messageId: Message.WRONG_SELECTOR,
        },
        {
          messageId: Message.WRONG_SELECTOR,
        },
        {
          messageId: Message.WRONG_SELECTOR,
        },
      ],
      output: `
<ds-test-themeable/>
<ds-test-themeable></ds-test-themeable>
<ds-test-themeable [test]="something"></ds-test-themeable>
        `,
    },
  ],
} as NamedTests;

export default rule;
