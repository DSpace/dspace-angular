import { testA11y } from 'cypress/support/utils';

describe('New Process', () => {
  // NOTE: these tests currently assume this query will return results!
  beforeEach(() => {
    // Must login as an Admin to see processes
    cy.visit('/processes/new');
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
  });

  it('should pass accessibility tests', () => {
    // Process form must first be visible
    cy.get('ds-new-process').should('be.visible');
    // Analyze <ds-new-process> for accessibility issues
    testA11y('ds-new-process');
  });
});
