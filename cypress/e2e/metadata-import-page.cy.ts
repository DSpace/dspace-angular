import { testA11y } from 'cypress/support/utils';

describe('Metadata Import Page', () => {
  beforeEach(() => {
    // Must login as an Admin to see the page
    cy.visit('/admin/metadata-import');
    cy.env(['DSPACE_TEST_ADMIN_USER', 'DSPACE_TEST_ADMIN_PASSWORD']).then(({ DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD }) => {
      cy.loginViaForm(DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD);
    });
  });

  it('should pass accessibility tests', () => {
    // Metadata import form must first be visible
    cy.get('ds-metadata-import-page').should('be.visible');
    // Analyze <ds-metadata-import-page> for accessibility issues
    testA11y('ds-metadata-import-page');
  });
});
