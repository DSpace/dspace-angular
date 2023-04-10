import { defineConfig } from 'cypress';

export default defineConfig({
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  fixturesFolder: 'cypress/fixtures',
  retries: {
    runMode: 2,
    openMode: 0,
  },
  env: {
    // Global constants used in DSpace e2e tests (see also ./cypress/support/e2e.ts)
    // May be overridden in our cypress.json config file using specified environment variables.
    // Default values listed here are all valid for the Demo Entities Data set available at
    // https://github.com/DSpace-Labs/AIP-Files/releases/tag/demo-entities-data
    // (This is the data set used in our CI environment)

    // Admin account used for administrative tests
    DSPACE_TEST_ADMIN_USER: 'dspacedemo+admin@gmail.com',
    DSPACE_TEST_ADMIN_PASSWORD: 'dspace',
    // Community/collection/publication used for view/edit tests
    DSPACE_TEST_COMMUNITY: '0958c910-2037-42a9-81c7-dca80e3892b4',
    DSPACE_TEST_COLLECTION: '282164f5-d325-4740-8dd1-fa4d6d3e7200',
    DSPACE_TEST_ENTITY_PUBLICATION: 'e98b0f27-5c19-49a0-960d-eb6ad5287067',
    // Search term (should return results) used in search tests
    DSPACE_TEST_SEARCH_TERM: 'test',
    // Collection used for submission tests
    DSPACE_TEST_SUBMIT_COLLECTION_NAME: 'Sample Collection',
    DSPACE_TEST_SUBMIT_COLLECTION_UUID: '9d8334e9-25d3-4a67-9cea-3dffdef80144',
    // Account used to test basic submission process
    DSPACE_TEST_SUBMIT_USER: 'dspacedemo+submit@gmail.com',
    DSPACE_TEST_SUBMIT_USER_PASSWORD: 'dspace',
  },
  e2e: {
    // Setup our plugins for e2e tests
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.ts')(on, config);
    },
    // This is the base URL that Cypress will run all tests against
    // It can be overridden via the CYPRESS_BASE_URL environment variable
    // (By default we set this to a value which should work in most development environments)
    baseUrl: 'http://localhost:4000',
  },
});
