import { testA11y } from 'cypress/support/utils';

describe('Epeople registry', () => {
  // NOTE: these tests currently assume this query will return results!
  beforeEach(() => {
    // Must login as an Admin to see processes
    cy.visit('/access-control/epeople');
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
  });

  it('should pass accessibility tests', () => {
    // Epeople registry page must first be visible
    cy.get('ds-epeople-registry').should('be.visible');
    // Analyze <ds-epeople-registry> for accessibility issues
    testA11y('ds-epeople-registry');
  });
});
