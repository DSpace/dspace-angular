import { testA11y } from 'cypress/support/utils';

describe('Browse By Author', () => {
  beforeEach(() => {
    cy.visit('/browse/author');
  });

  it('should pass accessibility tests', () => {
    // Wait for <ds-browse-by-metadata-page> to be visible
    cy.get('ds-browse-by-metadata').should('be.visible');

    // Analyze <ds-browse-by-metadata-page> for accessibility
    testA11y('ds-browse-by-metadata');
  });

  it('should filter browse by author results', () => {
    // Wait for <ds-browse-by-metadata-page> to be visible
    cy.get('ds-browse-by-metadata').should('be.visible');

    // Filter authors starting with "test"
    cy.get('[aria-label="Filter"]').type(Cypress.expose('DSPACE_TEST_SEARCH_TERM'));

    // Submit the current filter using the Browse button
    cy.get('ds-starts-with-text button[type="submit"]').click();

    // New URL should include startsWith param
    cy.url().should('include', `startsWith=${Cypress.expose('DSPACE_TEST_SEARCH_TERM')}`);

    // The page heading should reflect the active filter
    cy.get('h1').should('contain', `"${Cypress.expose('DSPACE_TEST_SEARCH_TERM')}"`);
  });
});
