import { testA11y } from 'cypress/support/utils';
import { Options } from 'cypress-axe';

xdescribe('Footer', () => {
    it('should pass accessibility tests', () => {
        cy.visit('/');

        // Footer must first be visible
        cy.get('ds-footer').should('be.visible');

        // Analyze <ds-footer> for accessibility
        testA11y('ds-footer',
          {
            rules: {
              'heading-order': { enabled: false }
            }
          } as Options
        );
    });
});
