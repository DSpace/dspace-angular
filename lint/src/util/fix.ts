/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { TSESTree } from '@typescript-eslint/utils';
import {
  RuleContext,
  RuleFix,
  RuleFixer,
} from '@typescript-eslint/utils/ts-eslint';

import { getSourceCode } from './typescript';



export function appendObjectProperties(context: RuleContext<any, any>, fixer: RuleFixer, objectNode: TSESTree.ObjectExpression, properties: string[]): RuleFix {
  // todo: may not handle empty objects too well
  const lastProperty = objectNode.properties[objectNode.properties.length - 1];
  const source = getSourceCode(context);
  const nextToken = source.getTokenAfter(lastProperty);

  // todo: newline & indentation are hardcoded for @Component({})
  // todo: we're assuming that we need trailing commas, what if we don't?
  const newPart = '\n' + properties.map(p => `  ${p},`).join('\n');

  if (nextToken !== null && nextToken.value === ',') {
    return fixer.insertTextAfter(nextToken, newPart);
  } else {
    return fixer.insertTextAfter(lastProperty, ',' + newPart);
  }
}

export function appendArrayElement(context: RuleContext<any, any>, fixer: RuleFixer, arrayNode: TSESTree.ArrayExpression, value: string): RuleFix {
  const source = getSourceCode(context);

  if (arrayNode.elements.length === 0) {
    // This is the first element
    const openArray = source.getTokenByRangeStart(arrayNode.range[0]);

    if (openArray == null) {
      throw new Error('Unexpected null token for opening square bracket');
    }

    // safe to assume the list is single-line
    return fixer.insertTextAfter(openArray, `${value}`);
  } else {
    const lastElement = arrayNode.elements[arrayNode.elements.length - 1];

    if (lastElement == null) {
      throw new Error('Unexpected null node in array');
    }

    const nextToken = source.getTokenAfter(lastElement);

    // todo: we don't know if the list is chopped or not, so we can't make any assumptions -- may produce output that will be flagged by other rules on the next run!
    // todo: we're assuming that we need trailing commas, what if we don't?
    if (nextToken !== null && nextToken.value === ',') {
      return fixer.insertTextAfter(nextToken, ` ${value},`);
    } else {
      return fixer.insertTextAfter(lastElement, `, ${value},`);
    }
  }

}

export function isLast(elementNode: TSESTree.Node): boolean {
  if (!elementNode.parent) {
    return false;
  }

  let siblingNodes: (TSESTree.Node | null)[] = [null];
  if (elementNode.parent.type === TSESTree.AST_NODE_TYPES.ArrayExpression) {
    siblingNodes = elementNode.parent.elements;
  } else if (elementNode.parent.type === TSESTree.AST_NODE_TYPES.ImportDeclaration) {
    siblingNodes = elementNode.parent.specifiers;
  }

  return elementNode === siblingNodes[siblingNodes.length - 1];
}

export function removeWithCommas(context: RuleContext<any, any>, fixer: RuleFixer, elementNode: TSESTree.Node): RuleFix[] {
  const ops = [];

  const source = getSourceCode(context);
  let nextToken = source.getTokenAfter(elementNode);
  let prevToken = source.getTokenBefore(elementNode);

  if (nextToken !== null && prevToken !== null) {
    if (nextToken.value === ',') {
      nextToken = source.getTokenAfter(nextToken);
      if (nextToken !== null) {
        ops.push(fixer.removeRange([elementNode.range[0], nextToken.range[0]]));
      }
    }
    if (isLast(elementNode) && prevToken.value === ',') {
      prevToken = source.getTokenBefore(prevToken);
      if (prevToken !== null) {
        ops.push(fixer.removeRange([prevToken.range[1], elementNode.range[1]]));
      }
    }
  } else if (nextToken !== null) {
    ops.push(fixer.removeRange([elementNode.range[0], nextToken.range[0]]));
  }

  return ops;
}

export function replaceOrRemoveArrayIdentifier(context: RuleContext<any, any>, fixer: RuleFixer, identifierNode: TSESTree.Identifier, newValue: string): RuleFix[] {
  if (identifierNode.parent.type !== TSESTree.AST_NODE_TYPES.ArrayExpression) {
    throw new Error('Parent node is not an array expression!');
  }

  const array = identifierNode.parent as TSESTree.ArrayExpression;

  for (const element of array.elements) {
    if (element !== null && element.type === TSESTree.AST_NODE_TYPES.Identifier && element.name === newValue) {
      return removeWithCommas(context, fixer, identifierNode);
    }
  }

  return [fixer.replaceText(identifierNode, newValue)];
}
