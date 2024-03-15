/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { TSESTree } from '@typescript-eslint/utils';

import { getObjectPropertyNodeByName } from './typescript';

export function getComponentSelectorNode(componentDecoratorNode: TSESTree.Decorator): TSESTree.StringLiteral | undefined {
  const initializer = (componentDecoratorNode.expression as TSESTree.CallExpression).arguments[0] as TSESTree.ObjectExpression;
  const property = getObjectPropertyNodeByName(initializer, 'selector');

  if (property !== undefined) {
    // todo: support template literals as well
    if (property.type === TSESTree.AST_NODE_TYPES.Literal && typeof property.value === 'string') {
      return property as TSESTree.StringLiteral;
    }
  }

  return undefined;
}

export function isPartOfViewChild(node: TSESTree.Identifier): boolean {
  return (node.parent as any)?.callee?.name === 'ViewChild';
}
