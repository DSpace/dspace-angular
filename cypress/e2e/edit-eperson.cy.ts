import { testA11y } from 'cypress/support/utils';

describe('Edit Eperson', () => {
  beforeEach(() => {
    // Must login as an Admin to see the page
    cy.visit('/access-control/epeople/'.concat(Cypress.expose('DSPACE_TEST_ADMIN_USER_UUID')).concat('/edit'));
    cy.env(['DSPACE_TEST_ADMIN_USER', 'DSPACE_TEST_ADMIN_PASSWORD']).then(({ DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD }) => {
      cy.loginViaForm(DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD);
    });
  });

  it('should pass accessibility tests', () => {
    // Form must first be visible
    cy.get('ds-eperson-form').should('be.visible');
    // Analyze <ds-eperson-form> for accessibility issues
    testA11y('ds-eperson-form');
  });
});
