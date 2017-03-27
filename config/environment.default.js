module.exports = {
  // The REST API server settings.
  "rest": {
    "ssl": false,
    "address": "localhost",
    "port": 3000,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    "nameSpace": "/api"
  },
  // Angular2 UI server settings.
  "ui": {
    "ssl": false,
    "address": "localhost",
    "port": 3000,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    "nameSpace": "/"
  },
  "cache": {
    // how long should objects be cached for by default
    "msToLive": 15 * 60 * 1000, // 15 minute
    "control": "max-age=60" // revalidate browser
  },
  "universal": {
    // Angular Universal settings
    "preboot": true,
    "async": true
  }
};
