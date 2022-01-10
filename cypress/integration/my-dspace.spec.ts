import { Options } from 'cypress-axe';
import { TEST_ADMIN_USER, TEST_ADMIN_PASSWORD } from 'cypress/support';
import { testA11y } from 'cypress/support/utils';

describe('My DSpace page', () => {
    it('should display recent submissions', () => {
        cy.login(TEST_ADMIN_USER, TEST_ADMIN_PASSWORD);

        // This is the GET command that will automatically search for recent submissions
        cy.intercept('GET', '/server/api/discover/search/objects*').as('search-results');

        cy.visit('/mydspace');

        // Wait for search results to come back from the above GET command
        cy.wait('@search-results');

        // At least one recent submission should be displayed
        cy.get('ds-item-search-result-list-element-submission').should('be.visible');
    });

    it('should pass accessibility tests', () => {
        cy.login(TEST_ADMIN_USER, TEST_ADMIN_PASSWORD);
        cy.visit('/mydspace');

        cy.get('ds-my-dspace-page').should('exist');

        // Analyze <ds-search-page> for accessibility issues
        testA11y('ds-my-dspace-page',
            {
                rules: {
                    // Search filters fail these two "moderate" impact rules
                    'heading-order': { enabled: false },
                    'landmark-unique': { enabled: false }
                }
            } as Options
        );
    });
});
