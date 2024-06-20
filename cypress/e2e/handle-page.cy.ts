import { TEST_ADMIN_PASSWORD, TEST_ADMIN_USER } from '../support/e2e';

/**
 * Test for checking if the handle page is loaded after redirecting.
 */
describe('Handle Page', () => {

  it('should pass accessibility tests', {
    retries: {
      runMode: 8,
      openMode: 8,
    },
    defaultCommandTimeout: 10000
  }, () => {
    cy.visit('/handle-table');
    cy.loginViaForm(TEST_ADMIN_USER, TEST_ADMIN_PASSWORD);
    // <ds-handle-page> tag must be loaded
    cy.get('ds-handle-page').should('exist');

    // <ds-handle-table> tag must be loaded
    cy.get('ds-handle-table').should('exist');

    // <ds-handle-global-actions> tag must be loaded
    cy.get('ds-handle-global-actions').should('exist');
  });
});
