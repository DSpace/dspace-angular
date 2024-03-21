/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import {
  TSESLint,
  TSESTree,
} from '@typescript-eslint/utils';

import { match } from './misc';

export type AnyRuleContext = TSESLint.RuleContext<string, unknown[]>;

export function getFilename(context: AnyRuleContext): string {
  // TSESLint claims this is deprecated, but the suggested alternative is undefined (could be a version mismatch between ESLint and TSESlint?)
  // eslint-disable-next-line deprecation/deprecation
  return context.getFilename();
}

export function getSourceCode(context: AnyRuleContext): TSESLint.SourceCode {
  // TSESLint claims this is deprecated, but the suggested alternative is undefined (could be a version mismatch between ESLint and TSESlint?)
  // eslint-disable-next-line deprecation/deprecation
  return context.getSourceCode();
}

export function getObjectPropertyNodeByName(objectNode: TSESTree.ObjectExpression, propertyName: string): TSESTree.Node | undefined {
  for (const propertyNode of objectNode.properties) {
    if (
      propertyNode.type === TSESTree.AST_NODE_TYPES.Property
      && (
        (
          propertyNode.key?.type === TSESTree.AST_NODE_TYPES.Identifier
          && propertyNode.key?.name === propertyName
        ) || (
          propertyNode.key?.type === TSESTree.AST_NODE_TYPES.Literal
          && propertyNode.key?.value === propertyName
        )
      )
    ) {
      return propertyNode.value;
    }
  }
  return undefined;
}

export function findUsages(context: AnyRuleContext, localNode: TSESTree.Identifier): TSESTree.Identifier[] {
  const source = getSourceCode(context);

  const usages: TSESTree.Identifier[] = [];

  for (const token of source.ast.tokens) {
    if (token.type === 'Identifier' && token.value === localNode.name && !match(token.range, localNode.range)) {
      const node = source.getNodeByRangeIndex(token.range[0]);
      // todo: in some cases, the resulting node can actually be the whole program (!)
      if (node !== null) {
        usages.push(node as TSESTree.Identifier);
      }
    }
  }

  return usages;
}

export function isPartOfTypeExpression(node: TSESTree.Identifier): boolean {
  return node.parent?.type?.startsWith('TSType');
}

export function isPartOfClassDeclaration(node: TSESTree.Identifier): boolean {
  return node.parent?.type === 'ClassDeclaration';
}
