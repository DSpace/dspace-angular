import { testA11y } from 'cypress/support/utils';

describe('Metadata Import Page', () => {
  // NOTE: these tests currently assume this query will return results!
  beforeEach(() => {
    // Must login as an Admin to see processes
    cy.visit('/admin/metadata-import');
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
  });

  it('should pass accessibility tests', () => {
    // Metadata import form must first be visible
    cy.get('ds-metadata-import-page').should('be.visible');
    // Analyze <ds-metadata-import-page> for accessibility issues
    testA11y('ds-metadata-import-page');
  });
});
