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

import {
  match,
  toUnixStylePath,
} from './misc';

export type AnyRuleContext = TSESLint.RuleContext<string, unknown[]>;

/**
 * Return the current filename based on the ESLint rule context as a Unix-style path.
 * This is easier for regex and comparisons to glob paths.
 */
export function getFilename(context: AnyRuleContext): string {
  // TSESLint claims this is deprecated, but the suggested alternative is undefined (could be a version mismatch between ESLint and TSESlint?)
  // eslint-disable-next-line deprecation/deprecation
  return toUnixStylePath(context.getFilename());
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
    if (token.type === TSESTree.AST_TOKEN_TYPES.Identifier && token.value === localNode.name && !match(token.range, localNode.range)) {
      const node = source.getNodeByRangeIndex(token.range[0]);
      // todo: in some cases, the resulting node can actually be the whole program (!)
      if (node !== null) {
        usages.push(node as TSESTree.Identifier);
      }
    }
  }

  return usages;
}

export function findUsagesByName(context: AnyRuleContext, identifier: string): TSESTree.Identifier[] {
  const source = getSourceCode(context);

  const usages: TSESTree.Identifier[] = [];

  for (const token of source.ast.tokens) {
    if (token.type === TSESTree.AST_TOKEN_TYPES.Identifier && token.value === identifier) {
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
  return node.parent?.type?.valueOf().startsWith('TSType');
}

export function isPartOfClassDeclaration(node: TSESTree.Identifier): boolean {
  return node.parent?.type === TSESTree.AST_NODE_TYPES.ClassDeclaration;
}

function fromSrc(path: string): string {
  const m = path.match(/^.*(src\/.+)(\.(ts|json|js)?)$/);

  if (m) {
    return m[1];
  } else {
    throw new Error(`Can't infer project-absolute TS/resource path from: ${path}`);
  }
}


export function relativePath(thisFile: string, importFile: string): string {
  const fromParts = fromSrc(thisFile).split('/');
  const toParts = fromSrc(importFile).split('/');

  let lastCommon = 0;
  for (let i = 0; i < fromParts.length - 1; i++) {
    if (fromParts[i] === toParts[i]) {
      lastCommon++;
    } else {
      break;
    }
  }

  const path = toParts.slice(lastCommon, toParts.length).join('/');
  const backtrack = fromParts.length - lastCommon - 1;

  let prefix: string;
  if (backtrack > 0) {
    prefix = '../'.repeat(backtrack);
  } else {
    prefix = './';
  }

  return prefix + path;
}


export function findImportSpecifier(context: AnyRuleContext, identifier: string): TSESTree.ImportSpecifier | undefined {
  const source = getSourceCode(context);

  const usages: TSESTree.Identifier[] = [];

  for (const token of source.ast.tokens) {
    if (token.type === TSESTree.AST_TOKEN_TYPES.Identifier && token.value === identifier) {
      const node = source.getNodeByRangeIndex(token.range[0]);
      // todo: in some cases, the resulting node can actually be the whole program (!)
      if (node && node.parent && node.parent.type === TSESTree.AST_NODE_TYPES.ImportSpecifier) {
        return node.parent;
      }
    }
  }

  return undefined;
}
