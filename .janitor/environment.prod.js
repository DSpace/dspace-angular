module.exports = {
  // Angular Universal server settings.
  ui: {
    ssl: false,
    host: '0.0.0.0',
    port: 3000,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    nameSpace: '/'
  },
  // The REST API server settings.
  rest: {
    ssl: true,
    host: 'dspace7.4science.it',
    port: 443,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    nameSpace: '/dspace-spring-rest/api'
  },
  // Caching settings
  cache: {
    // NOTE: how long should objects be cached for by default
    msToLive: 15 * 60 * 1000, // 15 minute
    control: 'max-age=60' // revalidate browser
  },
  // Angular Universal settings
  universal: {
    preboot: true,
    async: true,
    time: false
  },
  // Log directory
  logDirectory: '.',
  // NOTE: will log all redux actions and transfers in console
  debug: false
};