const fs = require('fs');

// These two global variables are used to store information about the REST API used
// by these e2e tests. They are filled out prior to running any tests in the before()
// method of e2e.ts. They can then be accessed by any tests via the getters below.
let REST_BASE_URL: string;
let REST_DOMAIN: string;

// Plugins enable you to tap into, modify, or extend the internal behavior of Cypress
// For more info, visit https://on.cypress.io/plugins-api
module.exports = (on, config) => {
  on('task', {
    // Define "log" and "table" tasks, used for logging accessibility errors during CI
    // Borrowed from https://github.com/component-driven/cypress-axe#in-cypress-plugins-file
    log(message: string) {
      console.log(message);
      return null;
    },
    table(message: string) {
      console.table(message);
      return null;
    },
    // Cypress doesn't have access to the running application in Node.js.
    // So, it's not possible to inject or load the AppConfig or environment of the Angular UI.
    // Instead, we'll read our running application's config.json, which contains the configs &
    // is regenerated at runtime each time the Angular UI application starts up.
    readUIConfig() {
      // Check if we have a config.json in the src/assets. If so, use that.
      // This is where it's written when running "ng e2e" or "yarn serve"
      if (fs.existsSync('./src/assets/config.json')) {
        return fs.readFileSync('./src/assets/config.json', 'utf8');
        // Otherwise, check the dist/browser/assets
        // This is where it's written when running "serve:ssr", which is what CI uses to start the frontend
      } else if (fs.existsSync('./dist/browser/assets/config.json')) {
        return fs.readFileSync('./dist/browser/assets/config.json', 'utf8');
      }

      return null;
    },
    // Save value of REST Base URL, looked up before all tests.
    // This allows other tests to use it easily via getRestBaseURL() below.
    saveRestBaseURL(url: string) {
      return (REST_BASE_URL = url);
    },
    // Retrieve currently saved value of REST Base URL
    getRestBaseURL() {
      return REST_BASE_URL ;
    },
    // Save value of REST Domain, looked up before all tests.
    // This allows other tests to use it easily via getRestBaseDomain() below.
    saveRestBaseDomain(domain: string) {
      return (REST_DOMAIN = domain);
    },
    // Retrieve currently saved value of REST Domain
    getRestBaseDomain() {
      return REST_DOMAIN ;
    },
  });
};
