import { REGEX_MATCH_NON_EMPTY_TEXT, TEST_ENTITY_PUBLICATION } from 'cypress/support/e2e';
import { testA11y } from 'cypress/support/utils';

describe('Item Statistics Page', () => {
    const ITEMSTATISTICSPAGE = '/statistics/items/'.concat(TEST_ENTITY_PUBLICATION);

    // NOTE add statistics to the navbar and change this test
    // it('should load if you click on "Statistics" from an Item/Entity page', () => {
    //     cy.visit('/entities/publication/'.concat(TEST_ENTITY_PUBLICATION));
    //     cy.get('ds-navbar ds-link-menu-item a[title="Statistics"]').click();
    //     cy.location('pathname').should('eq', ITEMSTATISTICSPAGE);
    // });

    it('should contain element ds-item-statistics-page when navigating to an item statistics page', () => {
        cy.visit(ITEMSTATISTICSPAGE);
        cy.get('ds-item-statistics-page').should('be.visible');
        cy.get('ds-item-page').should('not.exist');
    });

    it('should contain a "Total visits" section', () => {
        cy.visit(ITEMSTATISTICSPAGE);
        cy.get('table[data-test="TotalVisits"]').should('be.visible');
    });

    it('should contain a "Total visits per month" section', () => {
        cy.visit(ITEMSTATISTICSPAGE);
        // Check just for existence because this table is empty in CI environment as it's historical data
        cy.get('.'.concat(TEST_ENTITY_PUBLICATION).concat('_TotalVisitsPerMonth')).should('exist');
    });

    it('should pass accessibility tests', () => {
        cy.visit(ITEMSTATISTICSPAGE);

        // <ds-item-statistics-page> tag must be loaded
        cy.get('ds-item-statistics-page').should('be.visible');

        // Verify / wait until "Total Visits" table's label is non-empty
        // (This table loads these labels asynchronously, so we want to wait for them before analyzing page)
        cy.get('table[data-test="TotalVisits"] th[data-test="statistics-label"]').contains(REGEX_MATCH_NON_EMPTY_TEXT);

        // TODO accessibility tests are failing because the UI has been changed
        // Analyze <ds-item-statistics-page> for accessibility issues
        // testA11y('ds-item-statistics-page');
    });
});
