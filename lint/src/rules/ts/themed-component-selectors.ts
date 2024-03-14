/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { getComponentSelectorNode } from '../../util/angular';
import { stringLiteral } from '../../util/misc';
import {
  inThemedComponentOverrideFile,
  isThemeableComponent,
  isThemedComponentWrapper,
} from '../../util/theme-support';

export default ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: 'problem',
    schema: [],
    fixable: 'code',
    messages: {
      wrongSelectorUnthemedComponent: 'Unthemed version of themeable components should have a selector starting with \'ds-base-\'',
      wrongSelectorThemedComponentWrapper: 'Themed component wrapper of themeable components shouldn\'t have a selector starting with \'ds-themed-\'',
      wrongSelectorThemedComponentOverride: 'Theme override of themeable component should have a selector starting with \'ds-themed-\'',
    }
  },
  defaultOptions: [],
  create(context: any): any {
    if (context.getFilename()?.endsWith('.spec.ts')) {
      return {};
    }

    function enforceWrapperSelector(selectorNode: any) {
      if (selectorNode?.value.startsWith('ds-themed-')) {
        context.report({
          messageId: 'wrongSelectorThemedComponentWrapper',
          node: selectorNode,
          fix(fixer: any) {
            return fixer.replaceText(selectorNode, stringLiteral(selectorNode.value.replace('ds-themed-', 'ds-')));
          },
        });
      }
    }

    function enforceBaseSelector(selectorNode: any) {
      if (!selectorNode?.value.startsWith('ds-base-')) {
        context.report({
          messageId: 'wrongSelectorUnthemedComponent',
          node: selectorNode,
          fix(fixer: any) {
            return fixer.replaceText(selectorNode, stringLiteral(selectorNode.value.replace('ds-', 'ds-base-')));
          },
        });
      }
    }

    function enforceThemedSelector(selectorNode: any) {
      if (!selectorNode?.value.startsWith('ds-themed-')) {
        context.report({
          messageId: 'wrongSelectorThemedComponentOverride',
          node: selectorNode,
          fix(fixer: any) {
            return fixer.replaceText(selectorNode, stringLiteral(selectorNode.value.replace('ds-', 'ds-themed-')));
          },
        });
      }
    }

    return {
      'ClassDeclaration > Decorator[expression.callee.name = "Component"]'(node: any) {
        // keep track of all @Component nodes by their selector
        const selectorNode = getComponentSelectorNode(node);
        const selector = selectorNode?.value;
        const classNode = node.parent;
        const className = classNode.id?.name;

        if (selector === undefined || className === undefined) {
          return;
        }

        if (isThemedComponentWrapper(node)) {
          enforceWrapperSelector(selectorNode);
        } else if (inThemedComponentOverrideFile(context)) {
          enforceThemedSelector(selectorNode);
        } else if (isThemeableComponent(className)) {
          enforceBaseSelector(selectorNode);
        }
      }
    };
  }
});
