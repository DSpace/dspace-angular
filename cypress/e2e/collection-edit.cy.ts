import { testA11y } from 'cypress/support/utils';

const COLLECTION_EDIT_PAGE = '/collections/'.concat(Cypress.env('DSPACE_TEST_COLLECTION')).concat('/edit');

beforeEach(() => {
  // All tests start with visiting the Edit Collection Page
  cy.visit(COLLECTION_EDIT_PAGE);

  // This page is restricted, so we will be shown the login form. Fill it out & submit.
  cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
});

describe('Edit Collection > Edit Metadata tab', () => {
  it('should pass accessibility tests', () => {
    // <ds-edit-collection> tag must be loaded
    cy.get('ds-edit-collection').should('be.visible');

    // Analyze <ds-edit-collection> for accessibility issues
    testA11y('ds-edit-collection');
  });
});

describe('Edit Collection > Assign Roles tab', () => {

  it('should pass accessibility tests', () => {
    cy.get('a[data-test="roles"]').click();

    // <ds-collection-roles> tag must be loaded
    cy.get('ds-collection-roles').should('be.visible');

    // Analyze for accessibility issues
    testA11y('ds-collection-roles');
  });
});

describe('Edit Collection > Content Source tab', () => {

  it('should pass accessibility tests', () => {
    cy.get('a[data-test="source"]').click();

    // <ds-collection-source> tag must be loaded
    cy.get('ds-collection-source').should('be.visible');

    // Check the external source checkbox (to display all fields on the page)
    cy.get('#externalSourceCheck').check();

    // Wait for the source controls to appear
    // cy.get('ds-collection-source-controls').should('be.visible');

    // Analyze entire page for accessibility issues
    testA11y('ds-collection-source');
  });
});

describe('Edit Collection > Curate tab', () => {

  it('should pass accessibility tests', () => {
    cy.get('a[data-test="curate"]').click();

    // <ds-collection-curate> tag must be loaded
    cy.get('ds-collection-curate').should('be.visible');

    // Analyze for accessibility issues
    testA11y('ds-collection-curate');
  });
});

describe('Edit Collection > Access Control tab', () => {

  it('should pass accessibility tests', () => {
    cy.get('a[data-test="access-control"]').click();

    // <ds-collection-access-control> tag must be loaded
    cy.get('ds-collection-access-control').should('be.visible');

    // Analyze for accessibility issues
    testA11y('ds-collection-access-control');
  });
});

describe('Edit Collection > Authorizations tab', () => {

  it('should pass accessibility tests', () => {
    cy.get('a[data-test="authorizations"]').click();

    // <ds-collection-authorizations> tag must be loaded
    cy.get('ds-collection-authorizations').should('be.visible');

    // Analyze for accessibility issues
    testA11y('ds-collection-authorizations');
  });
});

describe('Edit Collection > Item Mapper tab', () => {

  it('should pass accessibility tests', () => {
    cy.get('a[data-test="mapper"]').click();

    // <ds-collection-item-mapper> tag must be loaded
    cy.get('ds-collection-item-mapper').should('be.visible');

    // Analyze entire page for accessibility issues
    testA11y('ds-collection-item-mapper');

    // Click on the "Map new Items" tab
    cy.get('li[data-test="mapTab"] a').click();

    // Make sure search form is now visible
    cy.get('ds-search-form').should('be.visible');

    // Analyze entire page (again) for accessibility issues
    testA11y('ds-collection-item-mapper');
  });
});


describe('Edit Collection > Delete page', () => {

  it('should pass accessibility tests', () => {
    cy.get('a[data-test="delete-button"]').click();

    // <ds-delete-collection> tag must be loaded
    cy.get('ds-delete-collection').should('be.visible');

    // Analyze for accessibility issues
    testA11y('ds-delete-collection');
  });
});
