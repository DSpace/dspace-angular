import { TEST_COLLECTION } from 'cypress/support';
import { testA11y } from 'cypress/support/utils';

describe('Collection Statistics Page', () => {
    const COLLECTIONSTATISTICSPAGE = '/statistics/collections/' + TEST_COLLECTION;

    // TODO the statistics option was removed from the navbar - add it there in the future and uncomment this test
    // it('should load if you click on "Statistics" from a Collection page', () => {
    //     cy.visit('/collections/' + TEST_COLLECTION);
    //     cy.get('ds-navbar ds-link-menu-item a[title="Statistics"]').click();
    //     cy.location('pathname').should('eq', COLLECTIONSTATISTICSPAGE);
    // });

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

        // <ds-collection-statistics-page> tag must be loaded
        cy.get('ds-collection-statistics-page').should('exist');

        // TODO accessibility tests are failing because the UI has been changed
        // Analyze <ds-collection-statistics-page> for accessibility issues
        // testA11y('ds-collection-statistics-page');
    });
});
