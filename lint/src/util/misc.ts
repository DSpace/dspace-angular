/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

export function match(rangeA: number[], rangeB: number[]) {
  return rangeA[0] === rangeB[0] && rangeA[1] === rangeB[1];
}


export function stringLiteral(value: string): string {
  return `'${value}'`;
}
