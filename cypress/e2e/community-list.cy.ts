import { testA11y } from 'cypress/support/utils';

describe('Community List Page', () => {

  it('should pass accessibility tests', () => {
    cy.visit('/community-list');

    // <ds-community-list-page> tag must be loaded
    cy.get('ds-community-list-page').should('be.visible');

    // Open every expand button on page, so that we can scan sub-elements as well
    cy.get('[data-test="expand-button"]').click({ multiple: true });

    // Analyze <ds-community-list-page> for accessibility issues
    testA11y('ds-community-list-page', {
      rules: {
        // When expanding a cdk node on the community-list page, the 'aria-posinset' property becomes 0.
        // 0 is not a valid value for 'aria-posinset' so the test fails.
        // see https://github.com/DSpace/dspace-angular/issues/4068
        'aria-valid-attr-value': { enabled: false },
      },
    });
  });
});
