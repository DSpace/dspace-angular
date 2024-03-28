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
  const property = getComponentInitializerNodeByName(componentDecoratorNode, 'selector');

  if (property !== undefined) {
    // todo: support template literals as well
    if (property.type === TSESTree.AST_NODE_TYPES.Literal && typeof property.value === 'string') {
      return property as TSESTree.StringLiteral;
    }
  }

  return undefined;
}

export function getComponentStandaloneNode(componentDecoratorNode: TSESTree.Decorator): TSESTree.BooleanLiteral | undefined {
  const property = getComponentInitializerNodeByName(componentDecoratorNode, 'standalone');

  if (property !== undefined) {
    if (property.type === TSESTree.AST_NODE_TYPES.Literal && typeof property.value === 'boolean') {
      return property as TSESTree.BooleanLiteral;
    }
  }

  return undefined;
}
export function getComponentImportNode(componentDecoratorNode: TSESTree.Decorator): TSESTree.ArrayExpression | undefined {
  const property = getComponentInitializerNodeByName(componentDecoratorNode, 'imports');

  if (property !== undefined) {
    if (property.type === TSESTree.AST_NODE_TYPES.ArrayExpression) {
      return property as TSESTree.ArrayExpression;
    }
  }

  return undefined;
}

export function getComponentClassName(decoratorNode: TSESTree.Decorator): string | undefined {
  if (decoratorNode.parent.type !== TSESTree.AST_NODE_TYPES.ClassDeclaration) {
    return undefined;
  }

  if (decoratorNode.parent.id?.type !== TSESTree.AST_NODE_TYPES.Identifier) {
    return undefined;
  }

  return decoratorNode.parent.id.name;
}

export function getComponentSuperClassName(decoratorNode: TSESTree.Decorator): string | undefined {
  if (decoratorNode.parent.type !== TSESTree.AST_NODE_TYPES.ClassDeclaration) {
    return undefined;
  }

  if (decoratorNode.parent.superClass?.type !== TSESTree.AST_NODE_TYPES.Identifier) {
    return undefined;
  }

  return decoratorNode.parent.superClass.name;
}

export function getComponentInitializer(componentDecoratorNode: TSESTree.Decorator): TSESTree.ObjectExpression {
  return (componentDecoratorNode.expression as TSESTree.CallExpression).arguments[0] as TSESTree.ObjectExpression;
}

export function getComponentInitializerNodeByName(componentDecoratorNode: TSESTree.Decorator, name: string): TSESTree.Node | undefined {
  const initializer = getComponentInitializer(componentDecoratorNode);
  return getObjectPropertyNodeByName(initializer, name);
}

export function isPartOfViewChild(node: TSESTree.Identifier): boolean {
  return (node.parent as any)?.callee?.name === 'ViewChild';
}
