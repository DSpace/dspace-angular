import { testA11y } from 'cypress/support/utils';

describe('System Wide Alert', () => {
  beforeEach(() => {
    // Must login as an Admin to see the page
    cy.visit('/admin/system-wide-alert');
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
  });

  it('should pass accessibility tests', () => {
    // Page must first be visible
    cy.get('ds-system-wide-alert-form').should('be.visible');
    // Analyze <ds-system-wide-alert-form> for accessibility issues
    testA11y('ds-system-wide-alert-form');
  });
});
