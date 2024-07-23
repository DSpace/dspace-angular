import { testA11y } from 'cypress/support/utils';
import { Options } from 'cypress-axe';


beforeEach(() => {
  // Must login as an Admin to see the page
  cy.visit('/health');
  cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
});

describe('Health Page > Status Tab', () => {
  it('should pass accessibility tests', () => {
    // Page must first be visible
    cy.get('ds-health-page').should('be.visible');
    // Analyze <ds-health-page> for accessibility issues
    testA11y('ds-health-page', {
      rules: {
        // All panels are accordians & fail "aria-required-children" and "nested-interactive".
        // Seem to require updating ng-bootstrap and https://github.com/DSpace/dspace-angular/issues/2216
        'aria-required-children': { enabled: false },
        'nested-interactive': { enabled: false },
      },
    } as Options);
  });
});

describe('Health Page > Info Tab', () => {
  it('should pass accessibility tests', () => {
    // Page must first be visible
    cy.get('ds-health-page').should('be.visible');
    cy.get('a[data-test="health-page.info-tab"]').click();

    cy.get('ds-health-info').should('be.visible');

    // Analyze <ds-health-info> for accessibility issues
    testA11y('ds-health-info', {
      rules: {
        // All panels are accordians & fail "aria-required-children" and "nested-interactive".
        // Seem to require updating ng-bootstrap and https://github.com/DSpace/dspace-angular/issues/2216
        'aria-required-children': { enabled: false },
        'nested-interactive': { enabled: false },
      },
    } as Options);
  });
});
