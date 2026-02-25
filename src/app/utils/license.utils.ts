/**
   * Parse a URI an return its CC code. URIs pointing to non-CC licenses will return null.
   * @param uri
   * @returns the CC code or null if uri is not a valid CC URI
   */
export function parseCcCode(uri: string): string {
  const regex = /.*creativecommons.org\/(licenses|publicdomain)\/([^/]+)/gm;
  const matches = regex.exec(uri ?? '') ?? [];
  return matches.length > 2 ? matches[2] : null;
}
