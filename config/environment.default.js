module.exports = {
  // The REST API server settings.
  "rest": {
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    "nameSpace": "/api",
    "protocol": "http",
    "address": "localhost",
    "port": 3000
  },
  // Angular2 UI server settings.
  "ui": {
    "nameSpace": "/",
    "protocol": "http",
    "address": "localhost",
    "port": 3000
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
