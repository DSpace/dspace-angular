import { TEST_COMMUNITY } from 'cypress/support';
import { testA11y } from 'cypress/support/utils';
import { Options } from 'cypress-axe';

describe('Community Page', () => {

    it('should pass accessibility tests', () => {
        cy.visit('/communities/' + TEST_COMMUNITY);

        // <ds-community-page> tag must be loaded
        cy.get('ds-community-page').should('exist');

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
