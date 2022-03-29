import { testA11y } from 'cypress/support/utils';

describe('Footer right background color', () => {
  it('should have backgroubd color from var --ds-footer-bg', () => {
    cy.visit('/');

    // Footer must have specific color
    cy.get('footer')
      .should('have.css', 'background-color', 'rgb(67, 81, 95)');

    // Analyze <ds-footer> for accessibility
    testA11y('footer');
  });
});
