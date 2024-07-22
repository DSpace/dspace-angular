import { testA11y } from 'cypress/support/utils';

describe('Create Eperson', () => {
  // NOTE: these tests currently assume this query will return results!
  beforeEach(() => {
    // Must login as an Admin to see processes
    cy.visit('/access-control/epeople/create');
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
  });

  it('should pass accessibility tests', () => {
    // Form must first be visible
    cy.get('ds-eperson-form').should('be.visible');
    // Analyze <ds-eperson-form> for accessibility issues
    testA11y('ds-eperson-form');
  });
});
