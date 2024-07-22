import { testA11y } from 'cypress/support/utils';

describe('Groups registry', () => {
  // NOTE: these tests currently assume this query will return results!
  beforeEach(() => {
    // Must login as an Admin to see processes
    cy.visit('/access-control/groups');
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
  });

  it('should pass accessibility tests', () => {
    // Epeople registry page must first be visible
    cy.get('ds-groups-registry').should('be.visible');
    // Analyze <ds-groups-registry> for accessibility issues
    testA11y('ds-groups-registry');
  });
});
