/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
export const ID = 'hashed-file-mapping';

/**
 * A mapping of plain path to hashed path, used for cache-busting files that are created dynamically after DSpace has been built.
 * The production server can register hashed files here and attach the map to index.html.
 * The browser can then use it to resolve hashed files and circumvent the browser cache.
 *
 * This can ensure that e.g. configuration changes are consistently served to all CSR clients.
 */
export abstract class HashedFileMapping {
  protected readonly map: Map<string, string> = new Map();

  /**
   * Resolve a hashed path based on a plain path.
   */
  resolve(plainPath: string): string {
    if (this.map.has(plainPath)) {
      const hashPath = this.map.get(plainPath);
      return hashPath;
    }
    return plainPath;
  }
}
