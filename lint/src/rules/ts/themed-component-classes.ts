/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import {
  ESLintUtils,
  TSESTree,
} from '@typescript-eslint/utils';
import { RuleContext } from '@typescript-eslint/utils/ts-eslint';

import { fixture } from '../../../test/fixture';
import {
  getComponentImportNode,
  getComponentInitializer,
  getComponentStandaloneNode,
} from '../../util/angular';
import { appendObjectProperties } from '../../util/fix';
import { DSpaceESLintRuleInfo } from '../../util/structure';
import {
  getBaseComponentClassName,
  inThemedComponentOverrideFile,
  isThemeableComponent,
  isThemedComponentWrapper,
} from '../../util/theme-support';
import { getFilename } from '../../util/typescript';

export enum Message {
  NOT_STANDALONE = 'mustBeStandalone',
  NOT_STANDALONE_IMPORTS_BASE = 'mustBeStandaloneAndImportBase',
  WRAPPER_IMPORTS_BASE = 'wrapperShouldImportBase',
}

export const info = {
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
  optionDocs: [],
  defaultOptions: [],
} as DSpaceESLintRuleInfo;

export const rule = ESLintUtils.RuleCreator.withoutDocs({
  ...info,
  create(context: RuleContext<Message, unknown[]>) {
    const filename = getFilename(context);

    if (filename.endsWith('.spec.ts')) {
      return {};
    }

    function enforceStandalone(decoratorNode: TSESTree.Decorator, withBaseImport = false) {
      const standaloneNode = getComponentStandaloneNode(decoratorNode);

      if (standaloneNode === undefined) {
        // We may need to add these properties in one go
        if (!withBaseImport) {
          context.report({
            messageId: Message.NOT_STANDALONE,
            node: decoratorNode,
            fix(fixer) {
              const initializer = getComponentInitializer(decoratorNode);
              return appendObjectProperties(context, fixer, initializer, ['standalone: true']);
            },
          });
        }
      } else if (!standaloneNode.value) {
        context.report({
          messageId: Message.NOT_STANDALONE,
          node: standaloneNode,
          fix(fixer) {
            return fixer.replaceText(standaloneNode, 'true');
          },
        });
      }

      if (withBaseImport) {
        const baseClass = getBaseComponentClassName(decoratorNode);

        if (baseClass === undefined) {
          return;
        }

        const importsNode = getComponentImportNode(decoratorNode);

        if (importsNode === undefined) {
          if (standaloneNode === undefined) {
            context.report({
              messageId: Message.NOT_STANDALONE_IMPORTS_BASE,
              node: decoratorNode,
              fix(fixer) {
                const initializer = getComponentInitializer(decoratorNode);
                return appendObjectProperties(context, fixer, initializer, ['standalone: true', `imports: [${baseClass}]`]);
              },
            });
          } else {
            context.report({
              messageId: Message.WRAPPER_IMPORTS_BASE,
              node: decoratorNode,
              fix(fixer) {
                const initializer = getComponentInitializer(decoratorNode);
                return appendObjectProperties(context, fixer, initializer, [`imports: [${baseClass}]`]);
              },
            });
          }
        } else {
          // If we have an imports node, standalone: true will be enforced by another rule

          const imports = importsNode.elements.map(e => (e as TSESTree.Identifier).name);

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
      'ClassDeclaration > Decorator[expression.callee.name = "Component"]'(node: TSESTree.Decorator) {
        const classNode = node.parent as TSESTree.ClassDeclaration;
        const className = classNode.id?.name;

        if (className === undefined) {
          return;
        }

        if (isThemedComponentWrapper(node)) {
          enforceStandalone(node, true);
        } else if (inThemedComponentOverrideFile(filename)) {
          enforceStandalone(node);
        } else if (isThemeableComponent(className)) {
          enforceStandalone(node);
        }
      },
    };
  },
});

export const tests = {
  plugin: info.name,
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
class TestThemeableComponent {
}
      `,
    },
    {
      name: 'Wrapper component',
      filename: fixture('src/app/test/themed-test-themeable.component.ts'),
      code: `
@Component({
  selector: 'ds-test-themable',
  standalone: true,
  imports: [
    TestThemeableComponent,
  ],
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
      `,
    },
    {
      name: 'Override component',
      filename: fixture('src/themes/test/app/test/test-themeable.component.ts'),
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
      errors:[
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
      filename: fixture('src/app/test/themed-test-themeable.component.ts'),
      code: `
@Component({
  selector: 'ds-test-themable',
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
      `,
      errors:[
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
      filename: fixture('src/app/test/themed-test-themeable.component.ts'),
      code: `
@Component({
  selector: 'ds-test-themable',
  standalone: true,
  imports: [],
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
      `,
      errors:[
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
      filename: fixture('src/app/test/themed-test-themeable.component.ts'),
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
      errors:[
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
    },    {
      name: 'Wrapper component must import base component (array is wrong)',
      filename: fixture('src/app/test/themed-test-themeable.component.ts'),
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
      errors:[
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
      filename: fixture('src/themes/test/app/test/test-themeable.component.ts'),
      code: `
@Component({
  selector: 'ds-themed-test-themable',
})
class Override extends BaseComponent {
}
      `,
      errors:[
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
