/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import {
  DISALLOWED_THEME_SELECTORS,
  fixSelectors,
} from '../../util/theme-support';

export default {
  meta: {
    type: 'problem',
    fixable: 'code',
    schema: [],
    messages: {
      mustUseThemedWrapperSelector: 'Themeable components should be used via their ThemedComponent wrapper\'s selector',
    }
  },
  create(context: any) {
    if (context.getFilename().includes('.spec.ts')) {
      // skip inline templates in unit tests
      return {};
    }

    return {
      [`Element$1[name = /^${DISALLOWED_THEME_SELECTORS}/]`](node: any) {
        context.report({
          messageId: 'mustUseThemedWrapperSelector',
          node,
          fix(fixer: any) {
            const oldSelector = node.name;
            const newSelector = fixSelectors(oldSelector);

            const openTagRange = [
              node.startSourceSpan.start.offset + 1,
              node.startSourceSpan.start.offset + 1 + oldSelector.length
            ];

            const ops = [
              fixer.replaceTextRange(openTagRange, newSelector),
            ];

            // make sure we don't mangle self-closing tags
            if (node.startSourceSpan.end.offset !== node.endSourceSpan.end.offset) {
              const closeTagRange = [
                node.endSourceSpan.start.offset + 2,
                node.endSourceSpan.end.offset - 1
              ];
              ops.push(fixer.replaceTextRange(closeTagRange, newSelector));
            }

            return ops;
          }
        });
      },
    };
  }
};
