module.exports = {
  // The REST API Location.
  "rest": {
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    "nameSpace": "/api",
    "protocol": "http",
    "address": "localhost",
    "port": 3000
  },
  // Protocol, path and port in use for this Angular2 UI
  "ui": {
    "nameSpace": "/",
    "protocol": "http",
    "address": "localhost",
    "port": 3000
  },
  "cache": {
    // how long should objects be cached for by default
    "msToLive": 1 * 60 * 1000, // 1 minute
  },
  "universal": {
    // universal settings
    "preboot": true,
    "async": true
  }
};
