export const environment = {
  /**
   * TODO add the sections from environment.common.ts you want to override here
   * e.g.
   * rest: {
   *   host: 'rest.api',
   *   nameSpace: '/rest/api',
   * }
   */
  rest: {
    ssl: false,
    host: 'localhost',
    port: 8080,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    nameSpace: '/server/api',
  },
};
