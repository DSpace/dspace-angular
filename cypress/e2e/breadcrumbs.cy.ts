import { testA11y } from 'cypress/support/utils';
import { Options } from 'cypress-axe';

xdescribe('Breadcrumbs', () => {
    it('should pass accessibility tests', () => {
        // Visit an Item, as those have more breadcrumbs
        cy.visit('/entities/publication/'.concat(Cypress.env('DSPACE_TEST_ENTITY_PUBLICATION')));

        // Wait for breadcrumbs to be visible
        cy.get('ds-breadcrumbs').should('be.visible');

        // Analyze <ds-breadcrumbs> for accessibility
        testA11y('ds-breadcrumbs',
          {
            rules: {
              'heading-order': { enabled: false }
            }
          } as Options
        );
    });
});
