import { REGEX_MATCH_NON_EMPTY_TEXT, TEST_COMMUNITY } from 'cypress/support/e2e';
import { testA11y } from 'cypress/support/utils';

describe('Community Statistics Page', () => {
    const COMMUNITYSTATISTICSPAGE = '/statistics/communities/'.concat(TEST_COMMUNITY);

    it('should load if you click on "Statistics" from a Community page', () => {
        cy.visit('/communities/'.concat(TEST_COMMUNITY));
        cy.get('ds-navbar ds-link-menu-item a[title="Statistics"]').click();
        cy.location('pathname').should('eq', COMMUNITYSTATISTICSPAGE);
    });

    it('should contain a "Total visits" section', () => {
        cy.visit(COMMUNITYSTATISTICSPAGE);
        cy.get('table[data-test="TotalVisits"]').should('be.visible');
    });

    it('should contain a "Total visits per month" section', () => {
        cy.visit(COMMUNITYSTATISTICSPAGE);
        // Check just for existence because this table is empty in CI environment as it's historical data
        cy.get('.'.concat(TEST_COMMUNITY).concat('_TotalVisitsPerMonth')).should('exist');
    });

    it('should pass accessibility tests', () => {
        cy.visit(COMMUNITYSTATISTICSPAGE);

        // <ds-community-statistics-page> tag must be loaded
        cy.get('ds-community-statistics-page').should('be.visible');

        // Verify / wait until "Total Visits" table's label is non-empty
        // (This table loads these labels asynchronously, so we want to wait for them before analyzing page)
        cy.get('table[data-test="TotalVisits"] th[data-test="statistics-label"]').contains(REGEX_MATCH_NON_EMPTY_TEXT);

        // Analyze <ds-community-statistics-page> for accessibility issues
        testA11y('ds-community-statistics-page');
    });
});
