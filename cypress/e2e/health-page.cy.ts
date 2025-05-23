import { testA11y } from 'cypress/support/utils';
import { Options } from 'cypress-axe';


beforeEach(() => {
  // Must login as an Admin to see the page
  cy.intercept('GET', '/server/actuator/health').as('status');
  cy.intercept('GET', '/server/actuator/info').as('info');
  cy.visit('/health');
  cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
});

describe('Health Page > Status Tab', () => {
  it('should pass accessibility tests', () => {
    cy.wait('@status');

    cy.get('a[data-test="health-page.status-tab"]').click();
    // Page must first be visible
    cy.get('ds-health-page').should('be.visible');
    cy.get('ds-health-panel').should('be.visible');

    // wait for all the ds-health-info-component components to be rendered
    cy.get('div[role="tabpanel"]').each(($panel: HTMLDivElement) => {
      cy.wrap($panel).find('ds-health-component').should('be.visible');
    });
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
    cy.wait('@info');

    cy.get('a[data-test="health-page.info-tab"]').click();
    // Page must first be visible
    cy.get('ds-health-page').should('be.visible');
    cy.get('ds-health-info').should('be.visible');

    // wait for all the ds-health-info-component components to be rendered
    cy.get('div[role="tabpanel"]').each(($panel: HTMLDivElement) => {
      cy.wrap($panel).find('ds-health-info-component').should('be.visible');
    });

    // Analyze <ds-health-info> for accessibility issues
    testA11y('ds-health-info', {
      rules: {
        // All panels are accordions & fail "aria-required-children" and "nested-interactive".
        // Seem to require updating ng-bootstrap and https://github.com/DSpace/dspace-angular/issues/2216
        'aria-required-children': { enabled: false },
        'nested-interactive': { enabled: false },
      },
    } as Options);
  });
});
