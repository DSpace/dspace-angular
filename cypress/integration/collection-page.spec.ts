import { Options } from "cypress-axe";
import { TEST_COLLECTION } from "cypress/support";

describe('Collection Page', () => {

    it('should pass accessibility tests', () => {
        cy.visit('/collections/' + TEST_COLLECTION);
        cy.injectAxe();

        // <ds-collection-page> tag must be loaded
        cy.get('ds-collection-page').should('exist');

        // Analyze <ds-collection-page> for accessibility issues
        // Disable color-contrast checks until it is fixed (see #1202 and #1178)
        cy.checkA11y('ds-collection-page',
            {
                rules: {
                    'color-contrast': { enabled: false }
                }
            } as Options
        );
    });
});
