import { testA11y } from 'cypress/support/utils';

describe('Bitstreams Formats', () => {
  beforeEach(() => {
    // Must login as an Admin to see the page
    cy.visit('/admin/registries/bitstream-formats');
    cy.env(['DSPACE_TEST_ADMIN_USER', 'DSPACE_TEST_ADMIN_PASSWORD']).then(({ DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD }) => {
      cy.loginViaForm(DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD);
    });
  });

  it('should pass accessibility tests', () => {
    // Page must first be visible
    cy.get('ds-bitstream-formats').should('be.visible');
    // Analyze <ds-bitstream-formats> for accessibility issues
    testA11y('ds-bitstream-formats');
  });

  it('should be able adding new bitstream formats', () => {
    // Add new button must first be visible
    cy.get('#create-new').find('a[class="btn btn-success"]').should('be.visible');
    // Click the button and ensure the url points to the add format page.
    cy.get('#create-new').find('a[class="btn btn-success"]').click();
    cy.url().should('match', /\/admin\/registries\/bitstream-formats\/add$/);
    cy.get('ds-add-bitstream-format').should('be.visible');
  });
});
