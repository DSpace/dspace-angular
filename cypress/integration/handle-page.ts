import { TEST_ADMIN_PASSWORD, TEST_ADMIN_USER } from '../support';

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
    cy.visit('/login');

    // Login as admin
    cy.loginViaForm(TEST_ADMIN_USER, TEST_ADMIN_PASSWORD);

    cy.visit('/handle-table');

    // <ds-handle-page> tag must be loaded
    cy.get('ds-handle-page').should('exist');

    // <ds-handle-table> tag must be loaded
    cy.get('ds-handle-table').should('exist');

    // <ds-handle-global-actions> tag must be loaded
    cy.get('ds-handle-global-actions').should('exist');
  });
});
