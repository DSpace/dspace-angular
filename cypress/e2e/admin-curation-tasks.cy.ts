import { testA11y } from 'cypress/support/utils';

describe('Admin Curation Tasks', () => {
  beforeEach(() => {
    // Must login as an Admin to see the page
    cy.visit('/admin/curation-tasks');
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
  });

  it('should pass accessibility tests', () => {
    // Page must first be visible
    cy.get('ds-admin-curation-task').should('be.visible');
    // Analyze <ds-admin-curation-task> for accessibility issues
    testA11y('ds-admin-curation-task');
  });
});
