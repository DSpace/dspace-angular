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
import { DSpaceESLintRuleInfo } from '../../util/structure';
import {
  allThemeableComponents,
  DISALLOWED_THEME_SELECTORS,
  fixSelectors,
  getThemeableComponentByBaseClass,
  inThemedComponentFile,
  isAllowedUnthemedUsage,
} from '../../util/theme-support';
import {
  findUsages,
  getFilename,
} from '../../util/typescript';

export enum Message {
  WRONG_CLASS = 'mustUseThemedWrapperClass',
  WRONG_IMPORT = 'mustImportThemedWrapper',
  WRONG_SELECTOR = 'mustUseThemedWrapperSelector',
}

export const info = {
  name: 'themed-component-usages',
  meta: {
    docs: {
      description: `Themeable components should be used via their \`ThemedComponent\` wrapper class

This ensures that custom themes can correctly override _all_ instances of this component.
There are a few exceptions where the base class can still be used:
- Class declaration expressions (otherwise we can't declare, extend or override the class in the first place)
- Angular modules (except for routing modules)
- Angular \`@ViewChild\` decorators
- Type annotations
      `,
    },
    type: 'problem',
    schema: [],
    fixable: 'code',
    messages: {
      [Message.WRONG_CLASS]: 'Themeable components should be used via their ThemedComponent wrapper',
      [Message.WRONG_IMPORT]: 'Themeable components should be used via their ThemedComponent wrapper',
      [Message.WRONG_SELECTOR]: 'Themeable components should be used via their ThemedComponent wrapper',
    },
  },
  defaultOptions: [],
} as DSpaceESLintRuleInfo;

export const rule = ESLintUtils.RuleCreator.withoutDocs({
  ...info,
  create(context: TSESLint.RuleContext<Message, unknown[]>) {
    const filename = getFilename(context);

    function handleUnthemedUsagesInTypescript(node: TSESTree.Identifier) {
      if (isAllowedUnthemedUsage(node)) {
        return;
      }

      const entry = getThemeableComponentByBaseClass(node.name);

      if (entry === undefined) {
        // this should never happen
        throw new Error(`No such themeable component in registry: '${node.name}'`);
      }

      context.report({
        messageId: Message.WRONG_CLASS,
        node: node,
        fix(fixer) {
          return fixer.replaceText(node, entry.wrapperClass);
        },
      });
    }

    function handleThemedSelectorQueriesInTests(node: TSESTree.Literal) {
      context.report({
        node,
        messageId: Message.WRONG_SELECTOR,
        fix(fixer){
          const newSelector = fixSelectors(node.raw);
          return fixer.replaceText(node, newSelector);
        },
      });
    }

    function handleUnthemedImportsInTypescript(specifierNode: TSESTree.ImportSpecifier) {
      const allUsages = findUsages(context, specifierNode.local);
      const badUsages = allUsages.filter(usage => !isAllowedUnthemedUsage(usage));

      if (badUsages.length === 0) {
        return;
      }

      const importedNode = specifierNode.imported;
      const declarationNode = specifierNode.parent as TSESTree.ImportDeclaration;

      const entry = getThemeableComponentByBaseClass(importedNode.name);
      if (entry === undefined) {
        // this should never happen
        throw new Error(`No such themeable component in registry: '${importedNode.name}'`);
      }

      context.report({
        messageId: Message.WRONG_IMPORT,
        node: importedNode,
        fix(fixer) {
          const ops = [];

          const oldImportSource = declarationNode.source.value;
          const newImportLine = `import { ${entry.wrapperClass} } from '${oldImportSource.replace(entry.baseFileName, entry.wrapperFileName)}';`;

          if (declarationNode.specifiers.length === 1) {
            if (allUsages.length === badUsages.length) {
              ops.push(fixer.replaceText(declarationNode, newImportLine));
            } else {
              ops.push(fixer.insertTextAfter(declarationNode, newImportLine));
            }
          } else {
            ops.push(fixer.replaceText(specifierNode, entry.wrapperClass));
            ops.push(fixer.insertTextAfter(declarationNode, newImportLine));
          }

          return ops;
        },
      });
    }

    // ignore tests and non-routing modules
    if (filename.endsWith('.spec.ts')) {
      return {
        [`CallExpression[callee.object.name = "By"][callee.property.name = "css"] > Literal:first-child[value = /.*${DISALLOWED_THEME_SELECTORS}.*/]`]: handleThemedSelectorQueriesInTests,
      };
    } else if (filename.endsWith('.cy.ts')) {
      return {
        [`CallExpression[callee.object.name = "cy"][callee.property.name = "get"] > Literal:first-child[value = /.*${DISALLOWED_THEME_SELECTORS}.*/]`]: handleThemedSelectorQueriesInTests,
      };
    } else if (
      filename.match(/(?!routing).module.ts$/)
      || filename.match(/themed-.+\.component\.ts$/)
      || inThemedComponentFile(context)
    ) {
      // do nothing
      return {};
    } else {
      return allThemeableComponents().reduce(
        (rules, entry) => {
          return {
            ...rules,
            [`:not(:matches(ClassDeclaration, ImportSpecifier)) > Identifier[name = "${entry.baseClass}"]`]: handleUnthemedUsagesInTypescript,
            [`ImportSpecifier[imported.name = "${entry.baseClass}"]`]: handleUnthemedImportsInTypescript,
          };
        }, {},
      );
    }

  },
});

export const tests = {
  plugin: info.name,
  valid: [
    {
      name: 'allow wrapper class usages',
      code: `
import { ThemedTestThemeableComponent } from '../test/themed-test-themeable.component.ts';

const config = {
  a: ThemedTestThemeableComponent,
  b: ChipsComponent,
}
        `,
    },
    {
      name: 'allow base class in class declaration',
      code: `
export class TestThemeableComponent {
}
        `,
    },
    {
      name: 'allow inheriting from base class',
      code: `
import { TestThemeableComponent } from '../test/test-themeable.component.ts';

export class ThemedAdminSidebarComponent extends ThemedComponent<TestThemeableComponent> {
}
        `,
    },
    {
      name: 'allow base class in ViewChild',
      code: `
import { TestThemeableComponent } from '../test/test-themeable.component.ts';

export class Something {
  @ViewChild(TestThemeableComponent) test: TestThemeableComponent;
}
        `,
    },
    {
      name: 'allow wrapper selectors in test queries',
      filename: fixture('src/app/test/test.component.spec.ts'),
      code: `
By.css('ds-themeable');
By.Css('#test > ds-themeable > #nest');
        `,
    },
    {
      name: 'allow wrapper selectors in cypress queries',
      filename: fixture('src/app/test/test.component.cy.ts'),
      code: `
By.css('ds-themeable');
By.Css('#test > ds-themeable > #nest');
        `,
    },
  ],
  invalid: [
    {
      name: 'disallow direct usages of base class',
      code: `
import { TestThemeableComponent } from '../test/test-themeable.component.ts';
import { TestComponent } from '../test/test.component.ts';

const config = {
  a: TestThemeableComponent,
  b: TestComponent,
}
        `,
      errors: [
        {
          messageId: Message.WRONG_IMPORT,
        },
        {
          messageId: Message.WRONG_CLASS,
        },
      ],
      output: `
import { ThemedTestThemeableComponent } from '../test/themed-test-themeable.component.ts';
import { TestComponent } from '../test/test.component.ts';

const config = {
  a: ThemedTestThemeableComponent,
  b: TestComponent,
}
        `,
    },
    {
      name: 'disallow override selector in test queries',
      filename: fixture('src/app/test/test.component.spec.ts'),
      code: `
By.css('ds-themed-themeable');
By.css('#test > ds-themed-themeable > #nest');
        `,
      errors: [
        {
          messageId: Message.WRONG_SELECTOR,
        },
        {
          messageId: Message.WRONG_SELECTOR,
        },
      ],
      output: `
By.css('ds-themeable');
By.css('#test > ds-themeable > #nest');
        `,
    },
    {
      name: 'disallow base selector in test queries',
      filename: fixture('src/app/test/test.component.spec.ts'),
      code: `
By.css('ds-base-themeable');
By.css('#test > ds-base-themeable > #nest');
        `,
      errors: [
        {
          messageId: Message.WRONG_SELECTOR,
        },
        {
          messageId: Message.WRONG_SELECTOR,
        },
      ],
      output: `
By.css('ds-themeable');
By.css('#test > ds-themeable > #nest');
        `,
    },
    {
      name: 'disallow override selector in cypress queries',
      filename: fixture('src/app/test/test.component.cy.ts'),
      code: `
cy.get('ds-themed-themeable');
cy.get('#test > ds-themed-themeable > #nest');
        `,
      errors: [
        {
          messageId: Message.WRONG_SELECTOR,
        },
        {
          messageId: Message.WRONG_SELECTOR,
        },
      ],
      output: `
cy.get('ds-themeable');
cy.get('#test > ds-themeable > #nest');
        `,
    },
    {
      name: 'disallow base selector in cypress queries',
      filename: fixture('src/app/test/test.component.cy.ts'),
      code: `
cy.get('ds-base-themeable');
cy.get('#test > ds-base-themeable > #nest');
        `,
      errors: [
        {
          messageId: Message.WRONG_SELECTOR,
        },
        {
          messageId: Message.WRONG_SELECTOR,
        },
      ],
      output: `
cy.get('ds-themeable');
cy.get('#test > ds-themeable > #nest');
        `,
    },
  ],
};

export default rule;
