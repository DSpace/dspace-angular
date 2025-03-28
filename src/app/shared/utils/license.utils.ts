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

/**
   * Returns whether a URI denotes a valid URI for CC licenses.
   * @param uri
   * @returns true if the URI corresponds to a reconigzable CC license URI or false otherwise
   */
export function isCcLicense(uri: string): boolean {
  return !!parseCcCode(uri);
}
