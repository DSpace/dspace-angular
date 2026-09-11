import { testA11y } from 'cypress/support/utils';

const COMMUNITY_PAGE = '/communities/'.concat(Cypress.expose('DSPACE_TEST_COMMUNITY'));


describe('Community Page', () => {

  it('should pass accessibility tests', () => {
    cy.visit(COMMUNITY_PAGE);

    // <ds-community-page> tag must be loaded
    cy.get('ds-community-page').should('be.visible');

    // Analyze <ds-community-page> for accessibility issues
    testA11y('ds-community-page');
  });
});


describe('Community Page -> Community-edit menu', () => {
  beforeEach(() => {
    cy.visit(COMMUNITY_PAGE);
    // Open login menu in header & verify <ds-log-in> tag is visible
    cy.get('[data-test="login-menu"]').click();
    cy.get('.form-login').should('be.visible');

    // Login, and the <ds-log-in> tag should no longer exist
    cy.env(['DSPACE_TEST_ADMIN_USER', 'DSPACE_TEST_ADMIN_PASSWORD']).then(({ DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD }) => {
      cy.loginViaForm(DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD);
    });
    cy.get('ds-log-in').should('not.exist');
  });

  it('Edit menu should exist for admins.', () => {
    // <dso-edit-menu> tag must be loaded
    cy.get('ds-dso-edit-menu').should('be.visible');
  });

  it('Options menu should include Add-Community and Add Collections Buttons.', () => {
    // Open the Options menu and verify the Add Community and Add Collection entries are available
    cy.get('ds-dso-edit-menu button[aria-label="Options"]').click();
    cy.get('[data-test="link-menu-item.community.add.sub-community"]')
      .should('be.visible')
      .and('contain', 'Add Community');
    cy.get('[data-test="link-menu-item.community.add.sub-collection"]')
      .should('be.visible')
      .and('contain', 'Add Collection');
  });
});
