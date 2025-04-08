import { testA11y } from 'cypress/support/utils';

describe('Admin Search Page', () => {
  beforeEach(() => {
    // Must login as an Admin to see the page
    cy.visit('/admin/search');
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
  });

  it('should pass accessibility tests', () => {
    //Page must first be visible
    cy.get('ds-admin-search-page').should('be.visible');
    // At least one search result should be displayed
    cy.get('[data-test="list-object"]').should('be.visible');
    // Click each filter toggle to open *every* filter
    // (As we want to scan filter section for accessibility issues as well)
    cy.get('[data-test="filter-toggle"]').click({ multiple: true });
    // Analyze <ds-admin-search-page> for accessibility issues
    testA11y('ds-admin-search-page');
  });
});
