import { testA11y } from 'cypress/support/utils';

describe('Homepage', () => {
  beforeEach(() => {
    // All tests start with visiting homepage
    cy.visit('/');
  });

  it('should display translated title "DSpace Repository :: Home"', () => {
    cy.title().should('eq', 'DSpace Repository :: Home');
  });

  it('should contain a news section', () => {
    cy.get('ds-home-news').should('be.visible');
  });

  it('should have a working search box', () => {
    const queryString = 'test';
    cy.get('[data-test="search-box"]').type(queryString);
    cy.get('[data-test="search-button"]').click();
    cy.url().should('include', '/search');
    cy.url().should('include', 'query=' + encodeURI(queryString));
  });

  it('should pass accessibility tests', () => {
    // Wait for homepage tag to appear
    cy.get('ds-home-page').should('be.visible');

    // Wait for at least one loading component to show up
    cy.get('ds-loading').should('exist');

    // Wait until all loading components have disappeared
    cy.get('ds-loading').should('not.exist');

    // Analyze <ds-home-page> for accessibility issues
    testA11y('ds-home-page');
  });
});
