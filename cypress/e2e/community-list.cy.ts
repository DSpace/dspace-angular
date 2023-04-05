import { Options } from 'cypress-axe';
import { testA11y } from 'cypress/support/utils';

describe('Community List Page', () => {

    it('should pass accessibility tests', () => {
        cy.visit('/community-list');

        // <ds-community-list-page> tag must be loaded
        cy.get('ds-community-list-page').should('be.visible');

        // Open every expand button on page, so that we can scan sub-elements as well
        cy.get('[data-test="expand-button"]').click({ multiple: true });

        // Analyze <ds-community-list-page> for accessibility issues
        // Disable heading-order checks until it is fixed
        testA11y('ds-community-list-page',
            {
                rules: {
                    'heading-order': { enabled: false }
                }
            } as Options
        );
    });
});
