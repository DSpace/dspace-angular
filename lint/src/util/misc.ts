/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

export function stringLiteral(value: string): string {
  return `'${value}'`;
}

export function match(rangeA: number[], rangeB: number[]) {
  return rangeA[0] === rangeB[0] && rangeA[1] === rangeB[1];
}

export function findUsages(context: any, localNode: any): any[] {
  const ast = context.getSourceCode().ast;

  const usages: any[] = [];

  for (const token of ast.tokens) {
    if (token.type === 'Identifier' && token.value === localNode.name && !match(token.range, localNode.range)) {
      usages.push(context.getSourceCode().getNodeByRangeIndex(token.range[0]));
    }
  }

  return usages;
}


export function isPartOfTypeExpression(node: any): boolean {
  return node.parent.type.startsWith('TSType');
}

export function isClassDeclaration(node: any): boolean {
  return node.parent.type === 'ClassDeclaration';
}

export function isPartOfViewChild(node: any): boolean {
  return node.parent?.callee?.name === 'ViewChild';
}
