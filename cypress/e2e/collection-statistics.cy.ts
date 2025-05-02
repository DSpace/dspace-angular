import { REGEX_MATCH_NON_EMPTY_TEXT } from 'cypress/support/e2e';
import { testA11y } from 'cypress/support/utils';

describe('Collection Statistics Page', () => {
  const COLLECTIONSTATISTICSPAGE = `/statistics/collections/${Cypress.env('DSPACE_TEST_COLLECTION')}`;

  it('should load if you click on "Statistics" from a Collection page', () => {
    cy.visit(`/collections/${Cypress.env('DSPACE_TEST_COLLECTION')}`);
    // Busca el enlace por su texto visible
    cy.contains('a', 'Statistics', { timeout: 10000 }).should('be.visible').click();
    cy.location('pathname').should('eq', COLLECTIONSTATISTICSPAGE);
  });

  it('should contain a "Total visits" section', () => {
    cy.visit(COLLECTIONSTATISTICSPAGE);
    cy.get('table[data-test="TotalVisits"]').should('be.visible');
  });

  it('should contain a "Total visits per month" section', () => {
    cy.visit(COLLECTIONSTATISTICSPAGE);
    cy.get(`.${Cypress.env('DSPACE_TEST_COLLECTION')}_TotalVisitsPerMonth`).should('exist');
  });

  it('should pass accessibility tests', () => {
    cy.visit(COLLECTIONSTATISTICSPAGE);
    cy.get('ds-collection-statistics-page').should('be.visible');
    cy.get('table[data-test="TotalVisits"] th[data-test="statistics-label"]')
      .contains(REGEX_MATCH_NON_EMPTY_TEXT);
    testA11y('ds-collection-statistics-page');
  });
});
