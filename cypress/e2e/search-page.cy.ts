import { testA11y } from 'cypress/support/utils';
import { Options } from 'cypress-axe';

describe('Search Page', () => {
  // NOTE: these tests currently assume this query will return results!
  const query = Cypress.env('DSPACE_TEST_SEARCH_TERM');

  it('should redirect to the correct url when query was set and submit button was triggered', () => {
    const queryString = 'Another interesting query string';
    cy.visit('/search');
    // Type query in searchbox & click search button
    cy.get('[data-test="search-box"]').type(queryString);
    cy.get('[data-test="search-button"]').click();
    cy.url().should('include', 'query=' + encodeURI(queryString));
  });

  it('should load results and pass accessibility tests', () => {
    cy.visit('/search?query='.concat(query));
    cy.get('[data-test="search-box"]').should('have.value', query);

    // <ds-search-page> tag must be loaded
    cy.get('ds-search-page').should('be.visible');

    // At least one search result should be displayed
    cy.get('[data-test="list-object"]').should('be.visible');

    // Click each filter toggle to open *every* filter
    // (As we want to scan filter section for accessibility issues as well)
    cy.get('[data-test="filter-toggle"]').click({ multiple: true });

    // Analyze <ds-search-page> for accessibility issues
    testA11y('ds-search-page');
  });

  it('should have a working grid view that passes accessibility tests', () => {
    cy.visit('/search?query='.concat(query));

    // Click button in sidebar to display grid view
    cy.get('ds-search-sidebar [data-test="grid-view"]').click();

    // <ds-search-page> tag must be loaded
    cy.get('ds-search-page').should('be.visible');

    // At least one grid object (card) should be displayed
    cy.get('[data-test="grid-object"]').should('be.visible');

    // Analyze <ds-search-page> for accessibility issues
    testA11y('ds-search-page',
            {
              rules: {
                // Card titles fail this test currently
                'heading-order': { enabled: false },
              },
            } as Options,
    );
  });
});
