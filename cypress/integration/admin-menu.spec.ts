import { loginProcess } from './submission-ui.spec';

describe('Community Page', () => {

  it('should pass accessibility tests', () => {
    // Login as admin
    cy.visit('/');
    loginProcess.clickOnLoginDropdown();
    loginProcess.typeEmail();
    loginProcess.typePassword();
    loginProcess.submit();

    // check handles redirect url in the <a> tag
    cy.get('.sidebar-top-level-items a[href = "/handle-table"]').scrollIntoView().should('be.visible');
  });
});
