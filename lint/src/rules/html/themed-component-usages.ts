/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { fixture } from '../../../test/fixture';
import { DSpaceESLintRuleInfo } from '../../util/structure';
import {
  DISALLOWED_THEME_SELECTORS,
  fixSelectors,
} from '../../util/theme-support';

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

export const rule = {
  ...info,
  create(context: any) {
    if (context.getFilename().includes('.spec.ts')) {
      // skip inline templates in unit tests
      return {};
    }

    return {
      [`Element$1[name = /^${DISALLOWED_THEME_SELECTORS}/]`](node: any) {
        context.report({
          messageId: Message.WRONG_SELECTOR,
          node,
          fix(fixer: any) {
            const oldSelector = node.name;
            const newSelector = fixSelectors(oldSelector);

            const openTagRange = [
              node.startSourceSpan.start.offset + 1,
              node.startSourceSpan.start.offset + 1 + oldSelector.length,
            ];

            const ops = [
              fixer.replaceTextRange(openTagRange, newSelector),
            ];

            // make sure we don't mangle self-closing tags
            if (node.startSourceSpan.end.offset !== node.endSourceSpan.end.offset) {
              const closeTagRange = [
                node.endSourceSpan.start.offset + 2,
                node.endSourceSpan.end.offset - 1,
              ];
              ops.push(fixer.replaceTextRange(closeTagRange, newSelector));
            }

            return ops;
          },
        });
      },
    };
  },
};

export const tests = {
  plugin: info.name,
  valid: [
    {
      code: `
<ds-test-themeable/>
<ds-test-themeable></ds-test-themeable>
<ds-test-themeable [test]="something"></ds-test-themeable>
        `,
    },
    {
      code: `
@Component({
  template: '<ds-test-themeable></ds-test-themeable>'
})
class Test {
}
        `,
    },
    {
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
};

export default rule;
