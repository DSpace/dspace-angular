/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

export const FIXTURE = 'lint/test/fixture/';

export function fixture(path: string): string {
  return FIXTURE + path;
}
