import { testA11y } from 'cypress/support/utils';
import { Options } from 'cypress-axe';

describe('Community Page', () => {

    it('should pass accessibility tests', () => {
        cy.visit('/communities/'.concat(Cypress.env('DSPACE_TEST_COMMUNITY')));

        // <ds-community-page> tag must be loaded
        cy.get('ds-community-page').should('be.visible');

        // Analyze <ds-community-page> for accessibility issues
        testA11y('ds-community-page',
          {
            rules: {
              'heading-order': { enabled: false }
            }
          } as Options
        );
    });
});
