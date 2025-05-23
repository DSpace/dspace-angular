import { testA11y } from 'cypress/support/utils';

const COMMUNITY_EDIT_PAGE = '/communities/'.concat(Cypress.env('DSPACE_TEST_COMMUNITY')).concat('/edit');

beforeEach(() => {
  // All tests start with visiting the Edit Community Page
  cy.visit(COMMUNITY_EDIT_PAGE);

  // This page is restricted, so we will be shown the login form. Fill it out & submit.
  cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
});

describe('Edit Community > Edit Metadata tab', () => {
  it('should pass accessibility tests', () => {
    // <ds-edit-community> tag must be loaded
    cy.get('ds-edit-community').should('be.visible');

    // Analyze <ds-edit-community> for accessibility issues
    testA11y('ds-edit-community');
  });
});

describe('Edit Community > Assign Roles tab', () => {

  it('should pass accessibility tests', () => {
    cy.get('a[data-test="roles"]').click();

    // <ds-community-roles> tag must be loaded
    cy.get('ds-community-roles').should('be.visible');

    // Analyze for accessibility issues
    testA11y('ds-community-roles');
  });
});

describe('Edit Community > Curate tab', () => {

  it('should pass accessibility tests', () => {
    cy.get('a[data-test="curate"]').click();

    // <ds-community-curate> tag must be loaded
    cy.get('ds-community-curate').should('be.visible');

    // Analyze for accessibility issues
    testA11y('ds-community-curate');
  });
});

describe('Edit Community > Access Control tab', () => {

  it('should pass accessibility tests', () => {
    cy.get('a[data-test="access-control"]').click();

    // <ds-community-access-control> tag must be loaded
    cy.get('ds-community-access-control').should('be.visible');

    // Analyze for accessibility issues
    testA11y('ds-community-access-control');
  });
});

describe('Edit Community > Authorizations tab', () => {

  it('should pass accessibility tests', () => {
    cy.get('a[data-test="authorizations"]').click();

    // <ds-community-authorizations> tag must be loaded
    cy.get('ds-community-authorizations').should('be.visible');

    // Analyze for accessibility issues
    testA11y('ds-community-authorizations');
  });
});

describe('Edit Community > Delete page', () => {

  it('should pass accessibility tests', () => {
    cy.get('a[data-test="delete-button"]').click();

    // <ds-delete-community> tag must be loaded
    cy.get('ds-delete-community').should('be.visible');

    // Analyze for accessibility issues
    testA11y('ds-delete-community');
  });
});
