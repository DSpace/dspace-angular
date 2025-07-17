import { testA11y } from 'cypress/support/utils';

describe('Audit Overview Page', () => {
  beforeEach(() => {
    // Must login as an Admin to see the page
    cy.visit('/auditlogs');
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
  });

  it('should pass accessibility tests', () => {
    // Page must first be visible
    cy.get('ds-audit-overview').should('be.visible');
    // Analyze <ds-audit-overview> for accessibility issues
    testA11y('ds-audit-overview');
  });
});
