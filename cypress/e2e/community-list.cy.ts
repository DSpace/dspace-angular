import { testA11y } from 'cypress/support/utils';

describe('Community List Page', () => {
  function validateHierarchyLevel(currentLevel = 1): void {
    // Find all <cdk-tree-node> elements with the current aria-level
    cy.get(`ds-community-list cdk-tree-node.expandable-node[aria-level="${currentLevel}"]`).should('exist').then(($nodes) => {
      let sublevelExists = false;
      cy.wrap($nodes).each(($node) => {
        // Check if the current node has an expand button and click it
        if ($node.find('[data-test="expand-button"]').length) {
          sublevelExists = true;
          cy.wrap($node).find('[data-test="expand-button"]').click();
        }
      }).then(() => {
        // After expanding all buttons, validate if a sublevel exists
        if (sublevelExists) {
          const nextLevelSelector = `ds-community-list cdk-tree-node.expandable-node[aria-level="${currentLevel + 1}"]`;
          cy.get(nextLevelSelector).then(($nextLevel) => {
            if ($nextLevel.length) {
              // Recursively validate the next level
              validateHierarchyLevel(currentLevel + 1);
            }
          });
        }
      });
    });
  }

  beforeEach(() => {
    cy.visit('/community-list');

    // <ds-community-list-page> tag must be loaded
    cy.get('ds-community-list-page').should('be.visible');

    // <ds-community-list-list> tag must be loaded
    cy.get('ds-community-list').should('be.visible');
  });

  it('should expand community/collection hierarchy', () => {
    // Execute Hierarchy levels validation recursively
    validateHierarchyLevel(1);
  });

  it('should display community/collections name with item count', () => {
    // Open every <cdk-tree-node>
    cy.get('[data-test="expand-button"]').click({ multiple: true });
    cy.wait(300);

    // A first <cdk-tree-node> must be found and validate that <a> tag (community name) and <span> tag (item count) exists in it
    cy.get('ds-community-list').find('cdk-tree-node.expandable-node').then(($nodes) => {
      cy.wrap($nodes).each(($node) => {
        cy.wrap($node).find('a').should('exist');
        cy.wrap($node).find('span').should('exist');
      });
    });
  });

  it('should enable "show more" button when 20 top-communities or more are presents', () => {
    cy.get('ds-community-list').find('cdk-tree-node.expandable-node[aria-level="1"]').then(($nodes) => {
      //Validate that there are 20 or more top-community elements
      if ($nodes.length >= 20) {
        //Validate that "show more" button is visible and then click on it
        cy.get('[data-test="show-more-button"]').should('be.visible');
      } else {
        cy.get('[data-test="show-more-button"]').should('not.exist');
      }
    });
  });

  it('should show 21 or more top-communities if click "show more" button', () => {
    cy.get('ds-community-list').find('cdk-tree-node.expandable-node[aria-level="1"]').then(($nodes) => {
      //Validate that there are 20 or more top-community elements
      if ($nodes.length >= 20) {
        //Validate that "show more" button is visible and then click on it
        cy.get('[data-test="show-more-button"]').click();
        cy.wait(300);
        cy.get('ds-community-list').find('cdk-tree-node.expandable-node[aria-level="1"]').should('have.length.at.least', 21);
      } else {
        cy.get('[data-test="show-more-button"]').should('not.exist');
      }
    });
  });

  it('should pass accessibility tests', () => {
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
