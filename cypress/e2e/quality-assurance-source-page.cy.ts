import { testA11y } from 'cypress/support/utils';

describe('Quality Assurance Source Page', () => {
  // NOTE: these tests currently assume this query will return results!
  beforeEach(() => {
    // Must login as an Admin to see processes
    cy.visit('/notifications/quality-assurance');
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
  });

  it('should pass accessibility tests', () => {
    // Source page must first be visible
    cy.get('ds-quality-assurance-source-page-component').should('be.visible');
    // Analyze <ds-quality-assurance-source-page-component> for accessibility issues
    testA11y('ds-quality-assurance-source-page-component');
  });
});
