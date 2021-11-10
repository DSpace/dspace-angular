export const environment = {
  /**
   * TODO add the sections from environment.common.ts you want to override here
   * e.g.
   * rest: {
   *   host: 'rest.api',
   *   nameSpace: '/rest',
   * }
   */
  // NOTE: these must be "synced" with the 'dspace.server.url' setting in your backend's local.cfg.
  rest: {
    ssl: true,
    host: 'dspacecris7.4science.cloud',
    port: 443,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    nameSpace: '/server',
  },
};
