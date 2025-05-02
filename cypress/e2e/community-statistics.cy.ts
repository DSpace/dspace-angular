import { REGEX_MATCH_NON_EMPTY_TEXT } from 'cypress/support/e2e';
import { testA11y } from 'cypress/support/utils';

describe('Community Statistics Page', () => {
  const COMMUNITYSTATISTICSPAGE = `/statistics/communities/${Cypress.env('DSPACE_TEST_COMMUNITY')}`;

  //solve error
  it('should load if you click on "Statistics" from a Community page', () => {
    cy.visit(`/communities/${Cypress.env('DSPACE_TEST_COMMUNITY')}`);
    cy.contains('a', 'Statistics', { timeout: 10000 }).should('be.visible').click();
    cy.location('pathname').should('eq', COMMUNITYSTATISTICSPAGE);
  });

  it('should contain a "Total visits" section', () => {
    cy.visit(COMMUNITYSTATISTICSPAGE);
    cy.get('table[data-test="TotalVisits"]').should('be.visible');
  });

  it('should contain a "Total visits per month" section', () => {
    cy.visit(COMMUNITYSTATISTICSPAGE);
    cy.get(`.${Cypress.env('DSPACE_TEST_COMMUNITY')}_TotalVisitsPerMonth`).should('exist');
  });

  it('should pass accessibility tests', () => {
    cy.visit(COMMUNITYSTATISTICSPAGE);
    cy.get('ds-community-statistics-page').should('be.visible');
    cy.get('table[data-test="TotalVisits"] th[data-test="statistics-label"]')
      .contains(REGEX_MATCH_NON_EMPTY_TEXT);
    testA11y('ds-community-statistics-page');
  });
});
