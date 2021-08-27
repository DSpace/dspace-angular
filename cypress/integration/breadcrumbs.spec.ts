import { Options } from "cypress-axe";
import { TEST_ENTITY_PUBLICATION } from "cypress/support";

describe('Breadcrumbs', () => {
    it('should pass accessibility tests', () => {
        // Visit an Item, as those have more breadcrumbs
        cy.visit('/entities/publication/' + TEST_ENTITY_PUBLICATION);
        cy.injectAxe();

        // Wait for breadcrumbs to be visible
        cy.get('ds-breadcrumbs').should('be.visible');

        // Analyze <ds-breadcrumbs> for accessibility
        // Disable color-contrast checks until #1149 is fixed
        cy.checkA11y('ds-breadcrumbs',
            {
                rules: {
                    'color-contrast': { enabled: false }
                }
            } as Options
        );
    });
});
