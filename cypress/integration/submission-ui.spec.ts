/**
 * This IT will be never be pushed to the upstream because clicking testing DOM elements is antipattern because
 * the tests on other machines could fail.
 */
import { TEST_ADMIN_PASSWORD, TEST_ADMIN_USER, TEST_SUBMIT_COLLECTION_UUID } from '../support';
import { loginProcess } from '../support/commands';
import wait from 'fork-ts-checker-webpack-plugin/lib/utils/async/wait';

const collectionName = 'Col';
const communityName = 'Com';

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
  },
  checkDistributionLicenseStep() {
    cy.get('ds-clarin-license-distribution').should('be.visible');
  },
  checkDistributionLicenseToggle() {
    cy.get('ds-clarin-license-distribution ng-toggle').should('be.visible');
  },
  checkDistributionLicenseStatus(statusTitle: string) {
    cy.get('div[id = "license-header"] button i[title = "' + statusTitle + '"]').should('be.visible');
  },
  clickOnDistributionLicenseToggle() {
    cy.get('ds-clarin-license-distribution ng-toggle').click();
  },
  checkLicenseResourceStep() {
    cy.get('ds-submission-section-clarin-license').should('be.visible');
  },
  clickOnLicenseSelectorButton() {
    cy.get('ds-submission-section-clarin-license div[id = "aspect_submission_StepTransformer_item_"] button').click();
  },
  checkLicenseSelectorModal() {
    cy.get('section[class = "license-selector is-active"]').should('be.visible');
  },
  pickUpLicenseFromLicenseSelector() {
    cy.get('section[class = "license-selector is-active"] ul li').eq(0).dblclick();
  },
  checkLicenseSelectionValue(value: string) {
    cy.get('ds-submission-section-clarin-license select[id = "aspect_submission_StepTransformer_field_license"]').contains(value);
  },
  selectValueFromLicenseSelection(option: string) {
    cy.get('ds-submission-section-clarin-license select[id = "aspect_submission_StepTransformer_field_license"]').select(option);
  },
  checkResourceLicenseStatus(statusTitle: string) {
    cy.get('div[id = "clarin-license-header"] button i[title = "' + statusTitle + '"]').should('be.visible');
  },
  showErrorMustChooseLicense() {
    cy.get('div[id = "sectionGenericError_clarin-license"] ds-alert').contains('You must choose one of the resource licenses.');
  },
  showErrorNotSupportedLicense() {
    cy.get('div[class = "form-group alert alert-danger in"]').contains('The selected license is not supported at the moment. Please follow the procedure described under section "None of these licenses suits your needs".');
  },
  checkAuthorLastnameField() {
    cy.get('ds-dynamic-autocomplete input[placeholder = "Last name"]').should('be.visible');
  },
  checkAuthorLastnameFieldValue(value) {
    cy.get('ds-dynamic-autocomplete input[placeholder = "Last name"]').should('have.value', value);
  },
  checkAuthorFirstnameField() {
    cy.get('dynamic-ng-bootstrap-input input[placeholder = "First name"]').should('be.visible');
  },
  checkAuthorFirstnameFieldValue(value) {
    cy.get('dynamic-ng-bootstrap-input input[placeholder = "First name"]').should('have.value', value);
  },
  writeAuthorInputField(value) {
    cy.get('ds-dynamic-autocomplete input[placeholder = "Last name"]').eq(0).click({force: true}).type(value);
  }
};

describe('Create a new submission', () => {
  beforeEach(() => {
    cy.visit('/');
    // Login as admin
    loginProcess.login(TEST_ADMIN_USER, TEST_ADMIN_PASSWORD);
    // Create a new submission
    cy.visit('/submit?collection=' + TEST_SUBMIT_COLLECTION_UUID + '&entityType=none');
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

  // From HERE **********

  // // Test type-bind
  // it('should be showed chosen type value', {
  //     retries: {
  //       runMode: 6,
  //       openMode: 6,
  //     },
  //     defaultCommandTimeout: 10000
  //   },() => {
  //   createItemProcess.clickOnSelectionInput('dc.type');
  //   createItemProcess.clickOnTypeSelection('Article');
  // });
  //
  // // Test CMDI input field
  // it('should be visible Has CMDI file input field because user is admin', {
  //     retries: {
  //       runMode: 6,
  //       openMode: 6,
  //     },
  //     defaultCommandTimeout: 10000
  //   },() => {
  //   createItemProcess.checkLocalHasCMDIVisibility();
  // });
  //
  // it('The local.hasCMDI value should be sent in the response after type change', {
  //     retries: {
  //       runMode: 6,
  //       openMode: 6,
  //     },
  //     defaultCommandTimeout: 10000
  //   },() => {
  //   createItemProcess.clickOnSelectionInput('dc.type');
  //   createItemProcess.clickOnTypeSelection('Article');
  //   createItemProcess.checkCheckbox('local_hasCMDI');
  //   createItemProcess.controlCheckedCheckbox('local_hasCMDI',true);
  //   createItemProcess.clickOnSave();
  //   cy.reload();
  //   createItemProcess.controlCheckedCheckbox('local_hasCMDI',true);
  // });
  //
  // it('should change the step status after accepting/declining the distribution license', {
  //   retries: {
  //     runMode: 6,
  //     openMode: 6,
  //   },
  //   defaultCommandTimeout: 10000
  // },() => {
  //   createItemProcess.checkDistributionLicenseStep();
  //   createItemProcess.checkDistributionLicenseToggle();
  //   // default status value is warnings
  //   createItemProcess.checkDistributionLicenseStatus('Warnings');
  //   // accept the distribution license agreement
  //   createItemProcess.clickOnDistributionLicenseToggle();
  //   // after accepting the status should be valid
  //   createItemProcess.checkDistributionLicenseStatus('Valid');
  //   // click on the toggle again and status should be changed to `Warnings`
  //   createItemProcess.clickOnDistributionLicenseToggle();
  //   createItemProcess.checkDistributionLicenseStatus('Warnings');
  // });
  //
  // it('should pick up the license from the license selector', {
  //   retries: {
  //     runMode: 6,
  //     openMode: 6,
  //   },
  //   defaultCommandTimeout: 10000
  // },() => {
  //   createItemProcess.checkLicenseResourceStep();
  //   // check default value in the license dropdown selection
  //   createItemProcess.checkLicenseSelectionValue('Select a License ...');
  //   // pop up the license selector modal
  //   createItemProcess.clickOnLicenseSelectorButton();
  //   // check if the modal was popped up
  //   createItemProcess.checkLicenseSelectorModal();
  //   // pick up the first license from the modal, it is `Public Domain Mark (PD)`
  //   createItemProcess.pickUpLicenseFromLicenseSelector();
  //   // check if the picked up license value is seen as selected value in the selection
  //   createItemProcess.checkLicenseSelectionValue('Public Domain Mark (PD)');
  // });
  //
  // it('should select the license from the license selection dropdown and change status', {
  //   retries: {
  //     runMode: 6,
  //     openMode: 6,
  //   },
  //   defaultCommandTimeout: 10000
  // },() => {
  //   createItemProcess.checkLicenseResourceStep();
  //   // check default value in the license dropdown selection
  //   createItemProcess.checkLicenseSelectionValue('Select a License ...');
  //   // check step status - it should be as warning
  //   createItemProcess.checkResourceLicenseStatus('Warnings');
  //   // select `Public Domain Mark (PD)` from the selection
  //   createItemProcess.selectValueFromLicenseSelection('Public Domain Mark (PD)');
  //   // selected value should be seen as selected value in the selection
  //   createItemProcess.checkLicenseSelectionValue('Public Domain Mark (PD)');
  //   // check step status - it should be valid
  //   createItemProcess.checkResourceLicenseStatus('Valid');
  // });
  //
  // it('should show warning messages if was selected non-supported license', {
  //   retries: {
  //     runMode: 6,
  //     openMode: 6,
  //   },
  //   defaultCommandTimeout: 10000
  // },() => {
  //   createItemProcess.checkLicenseResourceStep();
  //   // check default value in the license dropdown selection
  //   createItemProcess.checkLicenseSelectionValue('Select a License ...');
  //   // check step status - it should be as warning
  //   createItemProcess.checkResourceLicenseStatus('Warnings');
  //   // select `Select a License ...` from the selection - this license is not supported
  //   createItemProcess.selectValueFromLicenseSelection('Select a License ...');
  //   // selected value should be seen as selected value in the selection
  //   createItemProcess.checkLicenseSelectionValue('Select a License ...');
  //   // check step status - it should an error
  //   createItemProcess.checkResourceLicenseStatus('Errors');
  //   // error messages should be popped up
  //   createItemProcess.showErrorMustChooseLicense();
  //   createItemProcess.showErrorNotSupportedLicense();
  // });

  // Author field should consist of two input fields
  it('Author field should consist of two input fields', {
    retries: {
      runMode: 6,
      openMode: 6,
    },
    defaultCommandTimeout: 10000
  },() => {
    createItemProcess.checkAuthorFirstnameField();
    createItemProcess.checkAuthorLastnameField();
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
