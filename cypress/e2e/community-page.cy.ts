import { TEST_COMMUNITY } from 'cypress/support/e2e';
import { testA11y } from 'cypress/support/utils';

describe('Community Page', () => {

    it('should pass accessibility tests', () => {
        cy.visit('/communities/'.concat(TEST_COMMUNITY));

        // <ds-community-page> tag must be loaded
        cy.get('ds-community-page').should('be.visible');

        // Analyze <ds-community-page> for accessibility issues
        testA11y('ds-community-page',);
    });
});
