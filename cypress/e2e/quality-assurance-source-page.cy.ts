import { testA11y } from 'cypress/support/utils';

describe('Quality Assurance Source Page', () => {
  beforeEach(() => {
    // Must login as an Admin to see the page
    cy.visit('/notifications/quality-assurance');
    cy.env(['DSPACE_TEST_ADMIN_USER', 'DSPACE_TEST_ADMIN_PASSWORD']).then(({ DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD }) => {
      cy.loginViaForm(DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD);
    });
  });

  it('should pass accessibility tests', () => {
    // Source page must first be visible
    cy.get('ds-quality-assurance-source-page-component').should('be.visible');
    // Analyze <ds-quality-assurance-source-page-component> for accessibility issues
    testA11y('ds-quality-assurance-source-page-component');
  });
});
