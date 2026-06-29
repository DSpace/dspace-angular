import { testA11y } from 'cypress/support/utils';

describe('Batch Import Page', () => {
  beforeEach(() => {
    // Must login as an Admin to see processes
    cy.visit('/admin/batch-import');
    cy.env(['DSPACE_TEST_ADMIN_USER', 'DSPACE_TEST_ADMIN_PASSWORD']).then(({ DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD }) => {
      cy.loginViaForm(DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD);
    });
  });

  it('should pass accessibility tests', () => {
    // Batch import form must first be visible
    cy.get('ds-batch-import-page').should('be.visible');
    // Analyze <ds-batch-import-page> for accessibility issues
    testA11y('ds-batch-import-page');
  });
});
