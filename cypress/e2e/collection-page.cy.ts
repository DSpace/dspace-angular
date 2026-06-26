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
    // All tests start with visiting the Collection Page
    cy.visit(COLLECTION_PAGE);

    // These page elements are restricted, so we will be shown the login form. Fill it out & submit.
    cy.env(['DSPACE_TEST_ADMIN_USER', 'DSPACE_TEST_ADMIN_PASSWORD']).then(({ DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD }) => {
      cy.loginViaForm(DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD);
    });
  });

  it('Edit menu should exist for admins.', () => {
    // <dso-edit-menu> tag must be loaded
    cy.get('ds-dso-edit-menu').should('be.visible');
  });
});
