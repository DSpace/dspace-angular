/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import {
  ESLintUtils,
  TSESLint,
  TSESTree,
} from '@typescript-eslint/utils';

import { fixture } from '../../../test/fixture';
import { getComponentSelectorNode } from '../../util/angular';
import { stringLiteral } from '../../util/misc';
import { DSpaceESLintRuleInfo } from '../../util/structure';
import {
  inThemedComponentOverrideFile,
  isThemeableComponent,
  isThemedComponentWrapper,
} from '../../util/theme-support';
import { getFilename } from '../../util/typescript';

export enum Message {
  BASE = 'wrongSelectorUnthemedComponent',
  WRAPPER = 'wrongSelectorThemedComponentWrapper',
  THEMED = 'wrongSelectorThemedComponentOverride',
}

export const info = {
  name: 'themed-component-selectors',
  meta: {
    docs: {
      description: `Themeable component selectors should follow the DSpace convention

Each themeable component is comprised of a base component, a wrapper component and any number of themed components
- Base components should have a selector starting with \`ds-base-\`
- Themed components should have a selector starting with \`ds-themed-\`
- Wrapper components should have a selector starting with \`ds-\`, but not \`ds-base-\` or \`ds-themed-\`
  - This is the regular DSpace selector prefix
  - **When making a regular component themeable, its selector prefix should be changed to \`ds-base-\`, and the new wrapper's component should reuse the previous selector**

Unit tests are exempt from this rule, because they may redefine components using the same class name as other themeable components elsewhere in the source.
      `,
    },
    type: 'problem',
    schema: [],
    fixable: 'code',
    messages: {
      [Message.BASE]: 'Unthemed version of themeable component should have a selector starting with \'ds-base-\'',
      [Message.WRAPPER]: 'Themed component wrapper of themeable component shouldn\'t have a selector starting with \'ds-themed-\'',
      [Message.THEMED]: 'Theme override of themeable component should have a selector starting with \'ds-themed-\'',
    },
  },
  defaultOptions: [],
} as DSpaceESLintRuleInfo;

export const rule = ESLintUtils.RuleCreator.withoutDocs({
  ...info,
  create(context: TSESLint.RuleContext<Message, unknown[]>) {
    const filename = getFilename(context);

    if (filename.endsWith('.spec.ts')) {
      return {};
    }

    function enforceWrapperSelector(selectorNode: TSESTree.StringLiteral) {
      if (selectorNode?.value.startsWith('ds-themed-')) {
        context.report({
          messageId: Message.WRAPPER,
          node: selectorNode,
          fix(fixer) {
            return fixer.replaceText(selectorNode, stringLiteral(selectorNode.value.replace('ds-themed-', 'ds-')));
          },
        });
      }
    }

    function enforceBaseSelector(selectorNode: TSESTree.StringLiteral) {
      if (!selectorNode?.value.startsWith('ds-base-')) {
        context.report({
          messageId: Message.BASE,
          node: selectorNode,
          fix(fixer) {
            return fixer.replaceText(selectorNode, stringLiteral(selectorNode.value.replace('ds-', 'ds-base-')));
          },
        });
      }
    }

    function enforceThemedSelector(selectorNode: TSESTree.StringLiteral) {
      if (!selectorNode?.value.startsWith('ds-themed-')) {
        context.report({
          messageId: Message.THEMED,
          node: selectorNode,
          fix(fixer) {
            return fixer.replaceText(selectorNode, stringLiteral(selectorNode.value.replace('ds-', 'ds-themed-')));
          },
        });
      }
    }

    return {
      'ClassDeclaration > Decorator[expression.callee.name = "Component"]'(node: TSESTree.Decorator) {
        const selectorNode = getComponentSelectorNode(node);

        if (selectorNode === undefined) {
          return;
        }

        const selector = selectorNode?.value;
        const classNode = node.parent as TSESTree.ClassDeclaration;
        const className = classNode.id?.name;

        if (selector === undefined || className === undefined) {
          return;
        }

        if (isThemedComponentWrapper(node)) {
          enforceWrapperSelector(selectorNode);
        } else if (inThemedComponentOverrideFile(filename)) {
          enforceThemedSelector(selectorNode);
        } else if (isThemeableComponent(className)) {
          enforceBaseSelector(selectorNode);
        }
      },
    };
  },
});

export const tests = {
  plugin: info.name,
  valid: [
    {
      name: 'Regular non-themeable component selector',
      code: `
@Component({
  selector: 'ds-something',
})
class Something {
}
      `,
    },
    {
      name: 'Themeable component selector should replace the original version, unthemed version should be changed to ds-base-',
      code: `
@Component({
  selector: 'ds-base-something',
})
class Something {
}

@Component({
  selector: 'ds-something',
})
class ThemedSomething extends ThemedComponent<Something> {
}

@Component({
  selector: 'ds-themed-something',
})
class OverrideSomething extends Something {
}
      `,
    },
    {
      name: 'Other themed component wrappers should not interfere',
      code: `
@Component({
  selector: 'ds-something',
})
class Something {
}

@Component({
  selector: 'ds-something-else',
})
class ThemedSomethingElse extends ThemedComponent<SomethingElse> {
}
      `,
    },
  ],
  invalid: [
    {
      name: 'Wrong selector for base component',
      filename: fixture('src/app/test/test-themeable.component.ts'),
      code: `
@Component({
  selector: 'ds-something',
})
class TestThemeableComponent {
}
        `,
      errors: [
        {
          messageId: Message.BASE,
        },
      ],
      output: `
@Component({
  selector: 'ds-base-something',
})
class TestThemeableComponent {
}
        `,
    },
    {
      name: 'Wrong selector for wrapper component',
      filename: fixture('src/app/test/themed-test-themeable.component.ts'),
      code: `
@Component({
  selector: 'ds-themed-something',
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
        `,
      errors: [
        {
          messageId: Message.WRAPPER,
        },
      ],
      output: `
@Component({
  selector: 'ds-something',
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
        `,
    },
    {
      name: 'Wrong selector for theme override',
      filename: fixture('src/themes/test/app/test/test-themeable.component.ts'),
      code: `
@Component({
  selector: 'ds-something',
})
class TestThememeableComponent extends BaseComponent {
}
        `,
      errors: [
        {
          messageId: Message.THEMED,
        },
      ],
      output: `
@Component({
  selector: 'ds-themed-something',
})
class TestThememeableComponent extends BaseComponent {
}
        `,
    },
  ],
};

export default rule;
