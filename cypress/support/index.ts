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

// Runs once before the first test in each "block"
before(() => {
    // Pre-agree to all Klaro cookies by setting the klaro-anonymous cookie
    // This just ensures it doesn't get in the way of matching other objects in the page.
    cy.setCookie('klaro-anonymous', '{%22authentication%22:true%2C%22preferences%22:true%2C%22acknowledgement%22:true%2C%22google-analytics%22:true}');
});


// Global constants used in tests
// May be overridden in our cypress.json config file using specified environment variables.
// Default UUIDs listed here are all in the Demo Entities Data set available at
// https://github.com/DSpace-Labs/AIP-Files/releases/tag/demo-entities-data
// (This is the data set used in our CI environment)
export const TEST_REST_BASE_URL = Cypress.env('DSPACE_TEST_REST_BASE_URL') || 'http://localhost:8080';
export const TEST_ADMIN_USER = Cypress.env('DSPACE_TEST_ADMIN_USER') || 'dspacedemo+admin@gmail.com';
export const TEST_ADMIN_PASSWORD = Cypress.env('DSPACE_TEST_ADMIN_PASSWORD') || 'dspace';
export const TEST_COLLECTION = Cypress.env('DSPACE_TEST_COLLECTION') || '282164f5-d325-4740-8dd1-fa4d6d3e7200';
export const TEST_COMMUNITY = Cypress.env('DSPACE_TEST_COMMUNITY') || '0958c910-2037-42a9-81c7-dca80e3892b4';
export const TEST_ENTITY_PUBLICATION = Cypress.env('DSPACE_TEST_ENTITY_PUBLICATION') || 'e98b0f27-5c19-49a0-960d-eb6ad5287067';
