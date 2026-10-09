import { testA11y } from 'cypress/support/utils';

describe('Browse By Date Issued', () => {
  beforeEach(() => {
    cy.visit('/browse/dateissued');
  });

  it('should pass accessibility tests', () => {
    // Wait for <ds-browse-by-date-page> to be visible
    cy.get('ds-browse-by-date').should('be.visible');

    // Analyze <ds-browse-by-date-page> for accessibility
    testA11y('ds-browse-by-date');
  });

  it('should filter browse by issue date results', () => {
    // Wait for <ds-browse-by-date-page> to be visible
    cy.get('ds-browse-by-date').should('be.visible');

    // Filter issue dates starting with the first available year
    cy.get('#year-select option').eq(1).invoke('val').then((year) => {
      const selectedYear = year as string;
      cy.get('#year-select').select(selectedYear);

      // New URL should include startsWith param
      cy.url().should('include', `startsWith=${selectedYear}`);

      // The page heading should reflect the active filter
      cy.get('h1').should('contain', `"${selectedYear}"`);
    });
  });
});
