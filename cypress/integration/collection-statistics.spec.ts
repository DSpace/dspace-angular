import { TEST_COLLECTION } from "cypress/support";

describe('Collection Statistics Page', () => {
    const COLLECTIONSTATISTICSPAGE = '/statistics/collections/' + TEST_COLLECTION;

    it('should load if you click on "Statistics" from a Collection page', () => {
        cy.visit('/collections/' + TEST_COLLECTION);
        cy.get('ds-navbar ds-link-menu-item a[title="Statistics"]').click();
        cy.location('pathname').should('eq', COLLECTIONSTATISTICSPAGE);
    });

    it('should contain a "Total visits" section', () => {
        cy.visit(COLLECTIONSTATISTICSPAGE);
        cy.get('.' + TEST_COLLECTION + '_TotalVisits').should('exist');
    });

    it('should contain a "Total visits per month" section', () => {
        cy.visit(COLLECTIONSTATISTICSPAGE);
        cy.get('.' + TEST_COLLECTION + '_TotalVisitsPerMonth').should('exist');
    });

    it('should pass accessibility tests', () => {
        cy.visit(COLLECTIONSTATISTICSPAGE);
        cy.injectAxe();

        // <ds-collection-statistics-page> tag must be loaded
        cy.get('ds-collection-statistics-page').should('exist');

        // Analyze <ds-collection-statistics-page> for accessibility issues
        cy.checkA11y('ds-collection-statistics-page');
    });
});
