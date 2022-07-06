const password = 'admin';
const email = 'test@test.edu';
const collectionName = 'Col';
const communityName = 'Com';

const loginProcess = {
  clickOnLoginDropdown() {
    cy.get('.navbar-container .dropdownLogin ').click();
  },
  typeEmail() {
    cy.get('.navbar-container form input[type = "email"] ').type(email);
  },
  typePassword() {
    cy.get('.navbar-container form input[type = "password"] ').type(password);
  },
  submit() {
    cy.get('.navbar-container form button[type = "submit"] ').click();
  }
};

const createCommunityProcess = {
  clickOnCreateTopLevelComunity() {
    cy.get('.modal-body button').eq(0).click();
  },
  typeCommunityName() {
    cy.get('form input[id = "title"]').type(communityName);
  },
  submit() {
    cy.get('form div button[type = "submit"]').eq(0).click();
  }
};

const sideBarMenu = {
  clickOnNewButton() {
    cy.get('.sidebar-top-level-items div[role = "button"]').eq(0).click();
  },
  clickOnNewCommunityButton() {
    cy.get('.sidebar-sub-level-items a[role = "button"]').eq(0).click();
  },
  clickOnNewCollectionButton() {
    cy.get('.sidebar-sub-level-items a[role = "button"]').eq(1).click();
  },
  clickOnNewItemButton() {
    cy.get('.sidebar-sub-level-items a[role = "button"]').eq(2).click();
  }
};

const createCollectionProcess = {
  selectCommunity() {
    cy.get('.modal-body .scrollable-menu button[title = "' + communityName + '"]').eq(0).click();
  },
  typeCollectionName() {
    cy.get('form input[id = "title"]').type(collectionName);
  },
  submit() {
    cy.get('form div button[type = "submit"]').eq(0).click();
  }
};

const createItemProcess = {
  selectCollection() {
    cy.get('.modal-body .list-group div button .content').contains(collectionName).click();
  },
  checkLocalHasCMDIVisibility() {
    cy.get('#traditionalpageone form div[role = "group"] label[for = "local_hasCMDI"]').should('be.visible');
  },
  clickOnInput(inputName) {
    cy.get('#traditionalpageone form div[role = "group"] input[name = "' + inputName + '"]').click();
  },
  clickOnTypeSelection(selectionName) {
    cy.get('#traditionalpageone form div[role = "group"] div[role = "listbox"]' +
      ' button[title = "' + selectionName + '"]').click();
  },
  checkInputValue(inputName, observedInputValue) {
    cy.get('#traditionalpageone form div[role = "group"] div[role = "combobox"] input[name = "' + inputName + '"]')
      .should('contain',observedInputValue);
  },
  checkCheckbox(inputName) {
    cy.get('#traditionalpageone form div[role = "group"] div[id = "' + inputName + '"] input[type = "checkbox"]')
      .check({force: true});
  },
  controlCheckedCheckbox(inputName, checked) {
    const checkedCondition = checked === true ? 'be.checked' : 'not.be.checked';
    cy.get('#traditionalpageone form div[role = "group"] div[id = "' + inputName + '"] input[type = "checkbox"]')
      .should(checkedCondition);
  },
  clickOnSave() {
    cy.get('.submission-form-footer button[id = "save"]').click();
  }
};

describe('Create a new submission', () => {
  beforeEach(() => {
    cy.visit('/');
    // Login as admin
    loginProcess.clickOnLoginDropdown();
    loginProcess.typeEmail();
    loginProcess.typePassword();
    loginProcess.submit();

    // Create a new Community
    sideBarMenu.clickOnNewButton();
    sideBarMenu.clickOnNewCommunityButton();
    createCommunityProcess.clickOnCreateTopLevelComunity();
    createCommunityProcess.typeCommunityName();
    createCommunityProcess.submit();

    // Create a new Colletion
    cy.visit('/');
    sideBarMenu.clickOnNewButton();
    sideBarMenu.clickOnNewCollectionButton();
    createCollectionProcess.selectCommunity();
    createCollectionProcess.typeCollectionName();
    createCollectionProcess.submit();

    // Create a new Item
    cy.visit('/');
    sideBarMenu.clickOnNewButton();
    sideBarMenu.clickOnNewItemButton();
    createItemProcess.selectCollection();
  });

  // @TODO Uncomment this tests when the ACL, Complex input field, Type-bind and CMDI will be merged

  // it('should be visible Has CMDI file input field because user is admin', () => {
  //   createItemProcess.checkLocalHasCMDIVisibility();
  // });

  // it('should be showed chosen type value', () => {
  //   createItemProcess.clickOnInput('dc.type');
  //   createItemProcess.clickOnTypeSelection('Article');
  //   createItemProcess.checkInputValue('dc.type', 'Article');
  // });

  // it('The local.hasCMDI value should be sent in the response after type change', () => {
  //   createItemProcess.clickOnInput('dc.type');
  //   createItemProcess.clickOnTypeSelection('Article');
  //   createItemProcess.checkCheckbox('local_hasCMDI');
  //   createItemProcess.controlCheckedCheckbox('local_hasCMDI',true);
  //   createItemProcess.clickOnSave();
  //   cy.reload();
  //   createItemProcess.controlCheckedCheckbox('local_hasCMDI',true);
  // });
});
