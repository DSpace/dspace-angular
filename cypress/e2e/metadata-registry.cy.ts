import { testA11y } from 'cypress/support/utils';

describe('Metadata Registry', () => {
  beforeEach(() => {
    // Must login as an Admin to see the page
    cy.visit('/admin/registries/metadata');
    cy.env(['DSPACE_TEST_ADMIN_USER', 'DSPACE_TEST_ADMIN_PASSWORD']).then(({ DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD }) => {
      cy.loginViaForm(DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD);
    });
  });

  it('should pass accessibility tests', () => {
    // Page must first be visible
    cy.get('ds-metadata-registry').should('be.visible');
    // Analyze <ds-metadata-registry> for accessibility issues
    testA11y('ds-metadata-registry');
  });
});
