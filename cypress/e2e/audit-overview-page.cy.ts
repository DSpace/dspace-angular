import { testA11y } from 'cypress/support/utils';

describe('Audit Overview Page', () => {
  beforeEach(() => {
    // Must login as an Admin to see the page
    cy.visit('/auditlogs');
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
  });

  it('page structure should be correct and should pass accessibility tests', () => {
    // Page must first be visible
    cy.get('ds-audit-overview').should('be.visible');
    // Check for presence of main container and title
    cy.get('.container').should('exist');
    cy.get('[data-test="audit-title"]').should('be.visible');
    cy.get('body').then($body => {
      const hasTable = $body.find('[data-test="audit-table"]').length > 0;
      const hasEmpty = $body.find('[data-test="audit-empty"]').length > 0;
      // At least one present and not both
      expect(hasTable || hasEmpty).to.equal(true);
      expect(!(hasTable && hasEmpty)).to.equal(true);
    });
    // Analyze <ds-audit-overview> for accessibility issues
    testA11y('ds-audit-overview');
  });



});
