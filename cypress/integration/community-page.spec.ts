import { Options } from "cypress-axe";
import { TEST_COMMUNITY } from "cypress/support";

describe('Community Page', () => {

    it('should pass accessibility tests', () => {
        cy.visit('/communities/' + TEST_COMMUNITY);
        cy.injectAxe();

        // <ds-community-page> tag must be loaded
        cy.get('ds-community-page').should('exist');

        // Analyze <ds-community-page> for accessibility issues
        // Disable color-contrast checks until it is fixed (see #1202 and #1178)
        cy.checkA11y('ds-community-page',
            {
                rules: {
                    'color-contrast': { enabled: false }
                }
            } as Options
        );
    });
});
