/**
 * This IT will be never be pushed to the upstream because clicking testing DOM elements is antipattern because
 * the tests on other machines could fail.
 */

const CLARIN_DSPACE_PASSWORD = 'dspace';
const CLARIN_DSPACE_EMAIL = 'dspacedemo+admin@gmail.com';

const collectionName = 'Col';
const communityName = 'Com';

const loginProcess = {
  clickOnLoginDropdown() {
    cy.get('.navbar-container .dropdownLogin ').click();
  },
  typeEmail() {
    cy.get('.navbar-container form input[type = "email"] ').type(CLARIN_DSPACE_EMAIL);
  },
  typePassword() {
    cy.get('.navbar-container form input[type = "password"] ').type(CLARIN_DSPACE_PASSWORD);
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
  typeCollectionName() {
    cy.get('.modal-body input[type = "search"]').type(collectionName);
  },
  selectCollection() {
    cy.get('.modal-body .scrollable-menu button[title = "' + collectionName + '"]').eq(0).click();
  },
  checkLocalHasCMDIVisibility() {
    cy.get('#traditionalpageone form div[role = "group"] label[for = "local_hasCMDI"]').should('be.visible');
  },
  checkIsInputVisible(inputName, formatted = false, inputOrder = 0) {
    let inputNameTag = 'input[';
    inputNameTag += formatted ? 'ng-reflect-name' : 'name';
    inputNameTag += ' = ';

    cy.get('#traditionalpageone form div[role = "group"] ' + inputNameTag + '"' + inputName + '"]')
      .eq(inputOrder).should('be.visible');
  },
  checkIsNotInputVisible(inputName, formatted = false, inputOrder = 0) {
    let inputNameTag = 'input[';
    inputNameTag += formatted ? 'ng-reflect-name' : 'name';
    inputNameTag += ' = ';

    cy.get('#traditionalpageone form div[role = "group"] ' + inputNameTag + '"' + inputName + '"]')
      .eq(inputOrder).should('not.be.visible');
  },
  clickOnSelectionInput(inputName, inputOrder = 0) {
    cy.get('#traditionalpageone form div[role = "group"] input[name = "' + inputName + '"]').eq(inputOrder).click();
  },
  clickOnInput(inputName, force = false) {
    cy.get('#traditionalpageone form div[role = "group"] input[ng-reflect-name = "' + inputName + '"]')
      .click(force ? {force: true} : {});
  },
  writeValueToInput(inputName, value, formatted = false, inputOrder = 0) {
    if (formatted) {
      cy.get('#traditionalpageone form div[role = "group"] input[ng-reflect-name = "' + inputName + '"]').eq(inputOrder).click({force: true}).type(value);
    } else {
      cy.get('#traditionalpageone form div[role = "group"] input[name = "' + inputName + '"]').eq(inputOrder).click({force: true}).type(value);
    }
  },
  blurInput(inputName, formatted) {
    if (formatted) {
      cy.get('#traditionalpageone form div[role = "group"] input[ng-reflect-name = "' + inputName + '"]').blur();
    } else {
      cy.get('#traditionalpageone form div[role = "group"] input[name = "' + inputName + '"]').blur();
    }
  },
  clickOnTypeSelection(selectionName) {
    cy.get('#traditionalpageone form div[role = "group"] div[role = "listbox"]' +
      ' button[title = "' + selectionName + '"]').click();
  },
  clickOnSuggestionSelection(selectionNumber) {
    cy.get('#traditionalpageone form div[role = "group"] ngb-typeahead-window[role = "listbox"]' +
      ' button[type = "button"]').eq(selectionNumber).click();
  },

  clickOnDivById(id, force) {
    cy.get('div[id = "' + id + '"]').click(force ? {force: true} : {});
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
  },
  clickOnSelection(nameOfSelection, optionNumber) {
    cy.get('.dropdown-menu button[title="' + nameOfSelection + '"]').eq(optionNumber).click();
  },
  clickAddMore(inputFieldOrder) {
    cy.get('#traditionalpageone form div[role = "group"] button[title = "Add more"]').eq(inputFieldOrder)
      .click({force: true});
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
    createItemProcess.typeCollectionName();
    createItemProcess.selectCollection();
  });

  // Test openAIRE - configured more retries because it failed with 3 retries
  // Note: openAIRE tests are commented because they are failing in the server but locally they success.
  // it('should add non EU sponsor without suggestion', {
  //   retries: {
  //     runMode: 6,
  //     openMode: 6,
  //   },
  // },() => {
  //   // funding code
  //   cy.get('ds-dynamic-sponsor-autocomplete').eq(0).click({force: true}).type('code');
  //   // suggestion is popped up - must blur
  //   cy.get('body').click(0,0);
  //   cy.wait(250);
  //   // local.sponsor_COMPLEX_INPUT_3
  //   cy.get('ds-dynamic-sponsor-autocomplete').eq(1).click({force: true}).type('projectName');
  //   // blur because after each click on input will send PATCH request and the input value is removed
  //   cy.get('body').click(0,0);
  //   cy.wait(250);
  //   // select sponsor type
  //   createItemProcess.clickOnSelectionInput('local.sponsor_COMPLEX_INPUT_0');
  //   createItemProcess.clickOnSelection('N/A',0);
  //   cy.wait(250);
  //   // sponsor organisation
  //   createItemProcess.writeValueToInput('local.sponsor_COMPLEX_INPUT_2', 'organisation', false);
  // });
  //
  // it('should load and add EU sponsor from suggestion',{
  //   retries: {
  //     runMode: 6,
  //     openMode: 6,
  //   },
  // }, () => {
  //   // select sponsor type
  //   createItemProcess.clickOnSelectionInput('local.sponsor_COMPLEX_INPUT_0');
  //   createItemProcess.clickOnSelection('EU',0);
  //   cy.wait(250);
  //   // write suggestion for the eu sponsor - local.sponsor_COMPLEX_INPUT_1
  //   cy.get('ds-dynamic-sponsor-autocomplete').eq(0).click({force: true}).type('eve');
  //   // select suggestion
  //   createItemProcess.clickOnSuggestionSelection(0);
  //   cy.wait(250);
  //   // EU input field should be visible
  //   createItemProcess.checkIsInputVisible('local.sponsor_COMPLEX_INPUT_4');
  // });
  //
  // it('should add four EU sponsors', {
  //   retries: {
  //     runMode: 6,
  //     openMode: 6,
  //   },
  // },() => {
  //   // select sponsor type
  //   createItemProcess.clickOnSelectionInput('local.sponsor_COMPLEX_INPUT_0');
  //   createItemProcess.clickOnSelection('EU',0);
  //   cy.wait(250);
  //   // write suggestion for the eu sponsor - local.sponsor_COMPLEX_INPUT_1
  //   cy.get('ds-dynamic-sponsor-autocomplete').eq(0).click({force: true}).type('eve');
  //   // select suggestion
  //   createItemProcess.clickOnSuggestionSelection(0);
  //   cy.wait(250);
  //   // EU input field should be visible
  //   createItemProcess.checkIsInputVisible('local.sponsor_COMPLEX_INPUT_4');
  //
  //   // add another sponsors
  //   addEUSponsor(1);
  //   addEUSponsor(2);
  //   addEUSponsor(3);
  // });

  // Test type-bind
  it('should be showed chosen type value', () => {
    createItemProcess.clickOnSelectionInput('dc.type');
    createItemProcess.clickOnTypeSelection('Article');
  });

  // Test CMDI input field
  it('should be visible Has CMDI file input field because user is admin', () => {
    createItemProcess.checkLocalHasCMDIVisibility();
  });

  it('The local.hasCMDI value should be sent in the response after type change', () => {
    createItemProcess.clickOnSelectionInput('dc.type');
    createItemProcess.clickOnTypeSelection('Article');
    createItemProcess.checkCheckbox('local_hasCMDI');
    createItemProcess.controlCheckedCheckbox('local_hasCMDI',true);
    createItemProcess.clickOnSave();
    cy.reload();
    createItemProcess.controlCheckedCheckbox('local_hasCMDI',true);
  });
});

function addEUSponsor(euSponsorOrder) {
  createItemProcess.clickAddMore(1);
  // select sponsor type of second sponsor
  createItemProcess.clickOnSelectionInput('local.sponsor_COMPLEX_INPUT_0', euSponsorOrder);
  createItemProcess.clickOnSelection('EU',euSponsorOrder);
  cy.wait(500);
  // write suggestion for the eu sponsor
  // createItemProcess.writeValueToInput('local.sponsor_COMPLEX_INPUT_1', 'eve', true, euSponsorOrder);
  // euSponsorOrder * 2 because sponsor complex type has two ds-dynamic-sponsor-autocomplete inputs
  cy.get('ds-dynamic-sponsor-autocomplete').eq(euSponsorOrder * 2).click({force: true}).type('eve');
  // select suggestion
  createItemProcess.clickOnSuggestionSelection(euSponsorOrder * 2);
  cy.wait(250);
  // EU input field should be visible
  createItemProcess.checkIsInputVisible('local.sponsor_COMPLEX_INPUT_4', false, euSponsorOrder);
}
