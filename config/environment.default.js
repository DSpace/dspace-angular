module.exports = {
  "production": false,
  // The REST API Location.
  "rest": {
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    "nameSpace": "/api",
    "baseURL": "http://localhost:3000"
  },
  // Path and Port in use for this Angular2 UI
  "ui": {
    "nameSpace": "/",
    "baseURL": "http://localhost:3000"
  }
}
