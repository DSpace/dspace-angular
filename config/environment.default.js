module.exports = {
  "production": false,
  // The REST API Location.
  "rest": {
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    "nameSpace": "/api",
    "protocol": "http",
    "address": "localhost",
    "port": 3000
  },
  // Path and Port in use for this Angular2 UI
  "ui": {
    "nameSpace": "/",
    "protocol": "http",
    "address": "localhost",
    "port": 3000
  },
  "cache": {
    // how long should objects be cached for by default
    "msToLive": 15 * 60 * 1000, //15 minutes
  },
  "universal": {
    //on the client: start with the state on the server
    "shouldRehydrate": true,
    "preboot": true,
    "async": true
  }
};
