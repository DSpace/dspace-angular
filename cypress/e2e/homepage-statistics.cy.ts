import '../support/commands';

import { REGEX_MATCH_NON_EMPTY_TEXT } from 'cypress/support/e2e';
import { testA11y } from 'cypress/support/utils';

describe('Site Statistics Page', () => {
  it('should load if you click on "Statistics" from homepage', () => {
    cy.visit('/');
    cy.get('ds-navbar ds-link-menu-item a[data-test="link-menu-item.menu.section.statistics"]').click();
    cy.location('pathname').should('eq', '/statistics');
  });

  it('should pass accessibility tests', () => {
    // generate 2 view events on an Item's page
    cy.generateViewEvent(Cypress.env('DSPACE_TEST_ENTITY_PUBLICATION'), 'item');
    cy.generateViewEvent(Cypress.env('DSPACE_TEST_ENTITY_PUBLICATION'), 'item');

    cy.visit('/statistics');

    // <ds-site-statistics-page> tag must be visable
    cy.get('ds-site-statistics-page').should('be.visible');

    // Verify / wait until "Total Visits" table's *last* label is non-empty
    // (This table loads these labels asynchronously, so we want to wait for them before analyzing page)
    cy.get('table[data-test="TotalVisits"] th[data-test="statistics-label"]').last().contains(REGEX_MATCH_NON_EMPTY_TEXT);
    // Wait an extra 500ms, just so all entries in Total Visits have loaded.
    cy.wait(500);

    // Analyze <ds-site-statistics-page> for accessibility issues
    testA11y('ds-site-statistics-page');
  });
});
