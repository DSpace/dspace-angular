export const environment = {
  ui: {
    ssl: false,
    host: 'localhost',
    port: 4000,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    nameSpace: '/'
},
// This example is valid if your Backend is publicly available at https://api.mydspace.edu/server/
// The REST settings MUST correspond to the primary URL of the backend. Usually, this means they must be kept in sync
// with the value of "dspace.server.url" in the backend's local.cfg
rest: {
    ssl: false,
    host: 'localhost',
    port: 8080,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    nameSpace: '/server'
}
};
