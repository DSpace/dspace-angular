import { testA11y } from 'cypress/support/utils';
import { Options } from 'cypress-axe';

const ITEM_EDIT_PAGE = '/items/'.concat(Cypress.env('DSPACE_TEST_ENTITY_PUBLICATION')).concat('/edit');

beforeEach(() => {
  // All tests start with visiting the Edit Item Page
  cy.visit(ITEM_EDIT_PAGE);

  // This page is restricted, so we will be shown the login form. Fill it out & submit.
  cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
});

describe('Edit Item > Edit Metadata tab', () => {
  it('should pass accessibility tests', () => {
    cy.get('a[data-test="metadata"]').click();

    // <ds-edit-item-page> tag must be loaded
    cy.get('ds-edit-item-page').should('be.visible');

    // Analyze <ds-edit-item-page> for accessibility issues
    testA11y('ds-edit-item-page');
  });
});

describe('Edit Item > Status tab', () => {

  it('should pass accessibility tests', () => {
    cy.get('a[data-test="status"]').click();

    // <ds-item-status> tag must be loaded
    cy.get('ds-item-status').should('be.visible');

    // Analyze for accessibility issues
    testA11y('ds-item-status');
  });
});

describe('Edit Item > Bitstreams tab', () => {

  it('should pass accessibility tests', () => {
    cy.get('a[data-test="bitstreams"]').click();

    // <ds-item-bitstreams> tag must be loaded
    cy.get('ds-item-bitstreams').should('be.visible');

    // Table of item bitstreams must also be loaded
    cy.get('div.item-bitstreams').should('be.visible');

    // Analyze for accessibility issues
    testA11y('ds-item-bitstreams',
            {
              rules: {
                // Currently Bitstreams page loads a pagination component per Bundle
                // and they all use the same 'id="p-dad"'.
                'duplicate-id': { enabled: false },
              },
            } as Options,
    );
  });
});

describe('Edit Item > Curate tab', () => {

  it('should pass accessibility tests', () => {
    cy.get('a[data-test="curate"]').click();

    // <ds-item-curate> tag must be loaded
    cy.get('ds-item-curate').should('be.visible');

    // Analyze for accessibility issues
    testA11y('ds-item-curate');
  });
});

describe('Edit Item > Relationships tab', () => {

  it('should pass accessibility tests', () => {
    cy.get('a[data-test="relationships"]').click();

    // <ds-item-relationships> tag must be loaded
    cy.get('ds-item-relationships').should('be.visible');

    // Analyze for accessibility issues
    testA11y('ds-item-relationships');
  });
});

describe('Edit Item > Version History tab', () => {

  it('should pass accessibility tests', () => {
    cy.get('a[data-test="versionhistory"]').click();

    // <ds-item-version-history> tag must be loaded
    cy.get('ds-item-version-history').should('be.visible');

    // Analyze for accessibility issues
    testA11y('ds-item-version-history');
  });
});

describe('Edit Item > Access Control tab', () => {

  it('should pass accessibility tests', () => {
    cy.get('a[data-test="access-control"]').click();

    // <ds-item-access-control> tag must be loaded
    cy.get('ds-item-access-control').should('be.visible');

    // Analyze for accessibility issues
    testA11y('ds-item-access-control');
  });
});

describe('Edit Item > Collection Mapper tab', () => {

  it('should pass accessibility tests', () => {
    cy.get('a[data-test="mapper"]').click();

    // <ds-item-collection-mapper> tag must be loaded
    cy.get('ds-item-collection-mapper').should('be.visible');

    // Analyze entire page for accessibility issues
    testA11y('ds-item-collection-mapper');

    // Click on the "Map new collections" tab
    cy.get('li[data-test="mapTab"] a').click();

    // Make sure search form is now visible
    cy.get('ds-search-form').should('be.visible');

    // Analyze entire page (again) for accessibility issues
    testA11y('ds-item-collection-mapper');
  });
});
