// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import all custom Commands (from commands.ts) for all tests
import './commands';
// Import Cypress Axe tools for all tests
// https://github.com/component-driven/cypress-axe
import 'cypress-axe';

import { DSPACE_XSRF_COOKIE } from 'src/app/core/xsrf/xsrf.constants';

// Runs once before all tests
before(() => {
  // Cypress doesn't have access to the running application in Node.js.
  // So, it's not possible to inject or load the AppConfig or environment of the Angular UI.
  // Instead, we'll read our running application's config.json, which contains the configs &
  // is regenerated at runtime each time the Angular UI application starts up.
  cy.task('readUIConfig').then((str: string) => {
    // Parse config into a JSON object
    const config = JSON.parse(str);

    // Find URL of our REST API & save to global variable via task
    let baseRestUrl = FALLBACK_TEST_REST_BASE_URL;
    if (!config.rest.baseUrl) {
      console.warn("Could not load 'rest.baseUrl' from config.json. Falling back to " + FALLBACK_TEST_REST_BASE_URL);
    } else {
      baseRestUrl = config.rest.baseUrl;
    }
    cy.task('saveRestBaseURL', baseRestUrl);

    // Find domain of our REST API & save to global variable via task.
    let baseDomain = FALLBACK_TEST_REST_DOMAIN;
    if (!config.rest.host) {
      console.warn("Could not load 'rest.host' from config.json. Falling back to " + FALLBACK_TEST_REST_DOMAIN);
    } else {
      baseDomain = config.rest.host;
    }
    cy.task('saveRestBaseDomain', baseDomain);

  });
});

// Runs once before the first test in each "block"
beforeEach(() => {
  // Pre-agree to all Klaro cookies by setting the klaro-anonymous cookie
  // This just ensures it doesn't get in the way of matching other objects in the page.
  cy.setCookie('klaro-anonymous', '{%22authentication%22:true%2C%22preferences%22:true%2C%22acknowledgement%22:true%2C%22google-analytics%22:true%2C%22google-recaptcha%22:true}');

  // Remove any CSRF cookies saved from prior tests
  cy.clearCookie(DSPACE_XSRF_COOKIE);
});

// NOTE: FALLBACK_TEST_REST_BASE_URL is only used if Cypress cannot read the REST API BaseURL
// from the Angular UI's config.json. See 'before()' above.
const FALLBACK_TEST_REST_BASE_URL = 'http://localhost:8080/server';
const FALLBACK_TEST_REST_DOMAIN = 'localhost';

// USEFUL REGEX for testing

// Match any string that contains at least one non-space character
// Can be used with "contains()" to determine if an element has a non-empty text value
export const REGEX_MATCH_NON_EMPTY_TEXT = /^(?!\s*$).+/;
