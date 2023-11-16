import { REGEX_MATCH_NON_EMPTY_TEXT, TEST_COLLECTION } from 'cypress/support/e2e';
import { testA11y } from 'cypress/support/utils';

describe('Collection Statistics Page', () => {
    const COLLECTIONSTATISTICSPAGE = '/statistics/collections/'.concat(TEST_COLLECTION);

    it('should load if you click on "Statistics" from a Collection page', () => {
        cy.visit('/collections/'.concat(TEST_COLLECTION));
        cy.get('ds-navbar ds-link-menu-item a[title="Statistics"]').click();
        cy.location('pathname').should('eq', COLLECTIONSTATISTICSPAGE);
    });

    it('should contain a "Total visits" section', () => {
        cy.visit(COLLECTIONSTATISTICSPAGE);
        cy.get('table[data-test="TotalVisits"]').should('be.visible');
    });

    it('should contain a "Total visits per month" section', () => {
        cy.visit(COLLECTIONSTATISTICSPAGE);
        // Check just for existence because this table is empty in CI environment as it's historical data
        cy.get('.'.concat(TEST_COLLECTION).concat('_TotalVisitsPerMonth')).should('exist');
    });

    it('should pass accessibility tests', () => {
        cy.visit(COLLECTIONSTATISTICSPAGE);

        // <ds-collection-statistics-page> tag must be loaded
        cy.get('ds-collection-statistics-page').should('be.visible');

        // Verify / wait until "Total Visits" table's label is non-empty
        // (This table loads these labels asynchronously, so we want to wait for them before analyzing page)
        cy.get('table[data-test="TotalVisits"] th[data-test="statistics-label"]').contains(REGEX_MATCH_NON_EMPTY_TEXT);

        // Analyze <ds-collection-statistics-page> for accessibility issues
        testA11y('ds-collection-statistics-page');
    });
});
