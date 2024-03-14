/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { findUsages } from '../../util/misc';
import {
  allThemeableComponents,
  DISALLOWED_THEME_SELECTORS,
  fixSelectors,
  getThemeableComponentByBaseClass,
  inThemedComponentFile,
  isAllowedUnthemedUsage,
} from '../../util/theme-support';

export default ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: 'problem',
    schema: [],
    fixable: 'code',
    messages: {
      mustUseThemedWrapper: 'Themeable components should be used via their ThemedComponent wrapper',
      mustImportThemedWrapper: 'Themeable components should be used via their ThemedComponent wrapper',
    },
  },
  defaultOptions: [],
  create(context: any, options: any): any {
    function handleUnthemedUsagesInTypescript(node: any) {
      if (isAllowedUnthemedUsage(node)) {
        return;
      }

      const entry = getThemeableComponentByBaseClass(node.name);

      if (entry === undefined) {
        // this should never happen
        throw new Error(`No such themeable component in registry: '${node.name}'`);
      }

      context.report({
        messageId: 'mustUseThemedWrapper',
        node: node,
        fix(fixer: any) {
          return fixer.replaceText(node, entry.wrapperClass);
        },
      });
    }

    function handleThemedSelectorQueriesInTests(node: any) {

    }

    function handleUnthemedImportsInTypescript(specifierNode: any) {
      const allUsages = findUsages(context, specifierNode.local);
      const badUsages = allUsages.filter(usage => !isAllowedUnthemedUsage(usage));

      if (badUsages.length === 0) {
        return;
      }

      const importedNode = specifierNode.imported;
      const declarationNode = specifierNode.parent;

      const entry = getThemeableComponentByBaseClass(importedNode.name);
      if (entry === undefined) {
        // this should never happen
        throw new Error(`No such themeable component in registry: '${importedNode.name}'`);
      }

      context.report({
        messageId: 'mustImportThemedWrapper',
        node: importedNode,
        fix(fixer: any) {
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
    if (context.getFilename()?.endsWith('.spec.ts')) {
      return {
        [`CallExpression[callee.object.name = "By"][callee.property.name = "css"] > Literal[value = /.*${DISALLOWED_THEME_SELECTORS}.*/]`](node: any) {
          context.report({
            node,
            messageId: 'mustUseThemedWrapper',
            fix(fixer: any){
              const newSelector = fixSelectors(node.raw);
              return fixer.replaceText(node, newSelector);
            }
          });
        },
      };
    } else if (
      context.getFilename()?.match(/(?!routing).module.ts$/)
      || context.getFilename()?.match(/themed-.+\.component\.ts$/)
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
