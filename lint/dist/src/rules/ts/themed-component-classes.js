"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = exports.rule = exports.info = exports.Message = void 0;
/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
const utils_1 = require("@typescript-eslint/utils");
const fixture_1 = require("../../../test/fixture");
const angular_1 = require("../../util/angular");
const fix_1 = require("../../util/fix");
const theme_support_1 = require("../../util/theme-support");
const typescript_1 = require("../../util/typescript");
var Message;
(function (Message) {
    Message["NOT_STANDALONE"] = "mustBeStandalone";
    Message["NOT_STANDALONE_IMPORTS_BASE"] = "mustBeStandaloneAndImportBase";
    Message["WRAPPER_IMPORTS_BASE"] = "wrapperShouldImportBase";
})(Message || (exports.Message = Message = {}));
exports.info = {
    name: 'themed-component-classes',
    meta: {
        docs: {
            description: `Formatting rules for themeable component classes

- All themeable components must be standalone.
- The base component must always be imported in the \`ThemedComponent\` wrapper. This ensures that it is always sufficient to import just the wrapper whenever we use the component.
      `,
        },
        type: 'problem',
        fixable: 'code',
        schema: [],
        messages: {
            [Message.NOT_STANDALONE]: 'Themeable components must be standalone',
            [Message.NOT_STANDALONE_IMPORTS_BASE]: 'Themeable component wrapper classes must be standalone and import the base class',
            [Message.WRAPPER_IMPORTS_BASE]: 'Themed component wrapper classes must only import the base class',
        },
    },
    defaultOptions: [],
};
exports.rule = utils_1.ESLintUtils.RuleCreator.withoutDocs({
    ...exports.info,
    create(context) {
        const filename = (0, typescript_1.getFilename)(context);
        if (filename.endsWith('.spec.ts')) {
            return {};
        }
        function enforceStandalone(decoratorNode, withBaseImport = false) {
            const standaloneNode = (0, angular_1.getComponentStandaloneNode)(decoratorNode);
            if (standaloneNode === undefined) {
                // We may need to add these properties in one go
                if (!withBaseImport) {
                    context.report({
                        messageId: Message.NOT_STANDALONE,
                        node: decoratorNode,
                        fix(fixer) {
                            const initializer = (0, angular_1.getComponentInitializer)(decoratorNode);
                            return (0, fix_1.appendObjectProperties)(context, fixer, initializer, ['standalone: true']);
                        },
                    });
                }
            }
            else if (!standaloneNode.value) {
                context.report({
                    messageId: Message.NOT_STANDALONE,
                    node: standaloneNode,
                    fix(fixer) {
                        return fixer.replaceText(standaloneNode, 'true');
                    },
                });
            }
            if (withBaseImport) {
                const baseClass = (0, theme_support_1.getBaseComponentClassName)(decoratorNode);
                if (baseClass === undefined) {
                    return;
                }
                const importsNode = (0, angular_1.getComponentImportNode)(decoratorNode);
                if (importsNode === undefined) {
                    if (standaloneNode === undefined) {
                        context.report({
                            messageId: Message.NOT_STANDALONE_IMPORTS_BASE,
                            node: decoratorNode,
                            fix(fixer) {
                                const initializer = (0, angular_1.getComponentInitializer)(decoratorNode);
                                return (0, fix_1.appendObjectProperties)(context, fixer, initializer, ['standalone: true', `imports: [${baseClass}]`]);
                            },
                        });
                    }
                    else {
                        context.report({
                            messageId: Message.WRAPPER_IMPORTS_BASE,
                            node: decoratorNode,
                            fix(fixer) {
                                const initializer = (0, angular_1.getComponentInitializer)(decoratorNode);
                                return (0, fix_1.appendObjectProperties)(context, fixer, initializer, [`imports: [${baseClass}]`]);
                            },
                        });
                    }
                }
                else {
                    // If we have an imports node, standalone: true will be enforced by another rule
                    const imports = importsNode.elements.map(e => e.name);
                    if (!imports.includes(baseClass) || imports.length > 1) {
                        // The wrapper should _only_ import the base component
                        context.report({
                            messageId: Message.WRAPPER_IMPORTS_BASE,
                            node: importsNode,
                            fix(fixer) {
                                // todo: this may leave unused imports, but that's better than mangling things
                                return fixer.replaceText(importsNode, `[${baseClass}]`);
                            },
                        });
                    }
                }
            }
        }
        return {
            'ClassDeclaration > Decorator[expression.callee.name = "Component"]'(node) {
                const classNode = node.parent;
                const className = classNode.id?.name;
                if (className === undefined) {
                    return;
                }
                if ((0, theme_support_1.isThemedComponentWrapper)(node)) {
                    enforceStandalone(node, true);
                }
                else if ((0, theme_support_1.inThemedComponentOverrideFile)(filename)) {
                    enforceStandalone(node);
                }
                else if ((0, theme_support_1.isThemeableComponent)(className)) {
                    enforceStandalone(node);
                }
            },
        };
    },
});
exports.tests = {
    plugin: exports.info.name,
    valid: [
        {
            name: 'Regular non-themeable component',
            code: `
@Component({
  selector: 'ds-something',
  standalone: true,
})
class Something {
}
      `,
        },
        {
            name: 'Base component',
            code: `
@Component({
  selector: 'ds-base-test-themable',
  standalone: true,
})
class TestThemeableTomponent {
}
      `,
        },
        {
            name: 'Wrapper component',
            filename: (0, fixture_1.fixture)('src/app/test/themed-test-themeable.component.ts'),
            code: `
@Component({
  selector: 'ds-test-themable',
  standalone: true,
  imports: [
    TestThemeableComponent,
  ],
})
class ThemedTestThemeableTomponent extends ThemedComponent<TestThemeableComponent> {
}
      `,
        },
        {
            name: 'Override component',
            filename: (0, fixture_1.fixture)('src/themes/test/app/test/test-themeable.component.ts'),
            code: `
@Component({
  selector: 'ds-themed-test-themable',
  standalone: true,
})
class Override extends BaseComponent {
}
      `,
        },
    ],
    invalid: [
        {
            name: 'Base component must be standalone',
            code: `
@Component({
  selector: 'ds-base-test-themable',
})
class TestThemeableComponent {
}
      `,
            errors: [
                {
                    messageId: Message.NOT_STANDALONE,
                },
            ],
            output: `
@Component({
  selector: 'ds-base-test-themable',
  standalone: true,
})
class TestThemeableComponent {
}
      `,
        },
        {
            name: 'Wrapper component must be standalone and import base component',
            filename: (0, fixture_1.fixture)('src/app/test/themed-test-themeable.component.ts'),
            code: `
@Component({
  selector: 'ds-test-themable',
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
      `,
            errors: [
                {
                    messageId: Message.NOT_STANDALONE_IMPORTS_BASE,
                },
            ],
            output: `
@Component({
  selector: 'ds-test-themable',
  standalone: true,
  imports: [TestThemeableComponent],
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
      `,
        },
        {
            name: 'Wrapper component must import base component (array present but empty)',
            filename: (0, fixture_1.fixture)('src/app/test/themed-test-themeable.component.ts'),
            code: `
@Component({
  selector: 'ds-test-themable',
  standalone: true,
  imports: [],
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
      `,
            errors: [
                {
                    messageId: Message.WRAPPER_IMPORTS_BASE,
                },
            ],
            output: `
@Component({
  selector: 'ds-test-themable',
  standalone: true,
  imports: [TestThemeableComponent],
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
      `,
        },
        {
            name: 'Wrapper component must import base component (array is wrong)',
            filename: (0, fixture_1.fixture)('src/app/test/themed-test-themeable.component.ts'),
            code: `
import { SomethingElse } from './somewhere-else';

@Component({
  selector: 'ds-test-themable',
  standalone: true,
  imports: [
    SomethingElse,
  ],
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
      `,
            errors: [
                {
                    messageId: Message.WRAPPER_IMPORTS_BASE,
                },
            ],
            output: `
import { SomethingElse } from './somewhere-else';

@Component({
  selector: 'ds-test-themable',
  standalone: true,
  imports: [TestThemeableComponent],
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
      `,
        }, {
            name: 'Wrapper component must import base component (array is wrong)',
            filename: (0, fixture_1.fixture)('src/app/test/themed-test-themeable.component.ts'),
            code: `
import { Something, SomethingElse } from './somewhere-else';

@Component({
  selector: 'ds-test-themable',
  standalone: true,
  imports: [
    SomethingElse,
  ],
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
      `,
            errors: [
                {
                    messageId: Message.WRAPPER_IMPORTS_BASE,
                },
            ],
            output: `
import { Something, SomethingElse } from './somewhere-else';

@Component({
  selector: 'ds-test-themable',
  standalone: true,
  imports: [TestThemeableComponent],
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
      `,
        },
        {
            name: 'Override component must be standalone',
            filename: (0, fixture_1.fixture)('src/themes/test/app/test/test-themeable.component.ts'),
            code: `
@Component({
  selector: 'ds-themed-test-themable',
})
class Override extends BaseComponent {
}
      `,
            errors: [
                {
                    messageId: Message.NOT_STANDALONE,
                },
            ],
            output: `
@Component({
  selector: 'ds-themed-test-themable',
  standalone: true,
})
class Override extends BaseComponent {
}
      `,
        },
    ],
};
//# sourceMappingURL=themed-component-classes.js.map