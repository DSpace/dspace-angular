import { testA11y } from 'cypress/support/utils';

describe('Metadata Schema', () => {
  beforeEach(() => {
    // Must login as an Admin to see the page
    cy.visit('/admin/registries/metadata/dc');
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
  });

  it('should pass accessibility tests', () => {
    // Page must first be visible
    cy.get('ds-metadata-schema').should('be.visible');
    // Analyze <ds-metadata-schema> for accessibility issues
    testA11y('ds-metadata-schema');
  });
});
