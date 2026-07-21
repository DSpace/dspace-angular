import { testA11y } from 'cypress/support/utils';

const COLLECTION_PAGE = '/collections/'.concat(Cypress.expose('DSPACE_TEST_COLLECTION'));

describe('Collection Page', () => {

  it('should pass accessibility tests', () => {
    cy.visit(COLLECTION_PAGE);

    // <ds-collection-page> tag must be loaded
    cy.get('ds-collection-page').should('be.visible');

    // Analyze <ds-collection-page> for accessibility issues
    testA11y('ds-collection-page');
  });
});

describe('Collection Page -> Collection-edit menu', () => {
  beforeEach(() => {
    cy.visit(COLLECTION_PAGE);
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

  it('Options menu should include submit item on collection pages.', () => {
    // Open the Options menu and verify the Submit item entry is available
    cy.get('ds-dso-edit-menu button[aria-label="Options"]').click();
    cy.get('[data-test="link-menu-item.collection.submit.item"]')
      .should('be.visible')
      .and('contain', 'Submit item');
  });
});
