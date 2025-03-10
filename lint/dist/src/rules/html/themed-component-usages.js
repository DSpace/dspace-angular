"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = exports.rule = exports.info = exports.Message = void 0;
const utils_1 = require("@typescript-eslint/utils");
const fixture_1 = require("../../../test/fixture");
const theme_support_1 = require("../../util/theme-support");
const typescript_1 = require("../../util/typescript");
var Message;
(function (Message) {
    Message["WRONG_SELECTOR"] = "mustUseThemedWrapperSelector";
})(Message || (exports.Message = Message = {}));
exports.info = {
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
};
exports.rule = utils_1.ESLintUtils.RuleCreator.withoutDocs({
    ...exports.info,
    create(context) {
        if ((0, typescript_1.getFilename)(context).includes('.spec.ts')) {
            // skip inline templates in unit tests
            return {};
        }
        const parserServices = (0, typescript_1.getSourceCode)(context).parserServices;
        return {
            [`Element$1[name = /^${theme_support_1.DISALLOWED_THEME_SELECTORS}/]`](node) {
                const { startSourceSpan, endSourceSpan } = node;
                const openStart = startSourceSpan.start.offset;
                context.report({
                    messageId: Message.WRONG_SELECTOR,
                    loc: parserServices.convertNodeSourceSpanToLoc(startSourceSpan),
                    fix(fixer) {
                        const oldSelector = node.name;
                        const newSelector = (0, theme_support_1.fixSelectors)(oldSelector);
                        const ops = [
                            fixer.replaceTextRange([openStart + 1, openStart + 1 + oldSelector.length], newSelector),
                        ];
                        // make sure we don't mangle self-closing tags
                        if (endSourceSpan !== null && startSourceSpan.end.offset !== endSourceSpan.end.offset) {
                            const closeStart = endSourceSpan.start.offset;
                            const closeEnd = endSourceSpan.end.offset;
                            ops.push(fixer.replaceTextRange([closeStart + 2, closeEnd - 1], newSelector));
                        }
                        return ops;
                    },
                });
            },
        };
    },
});
exports.tests = {
    plugin: exports.info.name,
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
            filename: (0, fixture_1.fixture)('src/test.spec.ts'),
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
            filename: (0, fixture_1.fixture)('src/test.spec.ts'),
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
};
exports.default = exports.rule;
//# sourceMappingURL=themed-component-usages.js.map