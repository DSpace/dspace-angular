import { testA11y } from 'cypress/support/utils';

describe('Bitstreams Formats', () => {
  beforeEach(() => {
    // Must login as an Admin to see the page
    cy.visit('/admin/registries/bitstream-formats');
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
  });

  it('should pass accessibility tests', () => {
    // Page must first be visible
    cy.get('ds-bitstream-formats').should('be.visible');
    // Analyze <ds-bitstream-formats> for accessibility issues
    testA11y('ds-bitstream-formats');
  });
});
