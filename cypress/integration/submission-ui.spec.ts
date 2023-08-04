/**
 * This IT will be never be pushed to the upstream because clicking testing DOM elements is antipattern because
 * the tests on other machines could fail.
 */
import {
  TEST_ADMIN_PASSWORD,
  TEST_ADMIN_USER,
  TEST_SUBMIT_CLARIAH_COLLECTION_UUID,
  TEST_SUBMIT_COLLECTION_UUID
} from '../support';
import { createItemProcess } from '../support/commands';


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

describe('Create a new submission', () => {
  beforeEach(() => {
    // Create a new submission
    cy.visit('/submit?collection=' + TEST_SUBMIT_COLLECTION_UUID + '&entityType=none');

    // This page is restricted, so we will be shown the login form. Fill it out & submit.
    cy.loginViaForm(TEST_ADMIN_USER, TEST_ADMIN_PASSWORD);
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
  it('should be showed chosen type value', {
      retries: {
        runMode: 6,
        openMode: 6,
      },
      defaultCommandTimeout: 10000
    },() => {
    createItemProcess.clickOnSelectionInput('dc.type');
    createItemProcess.clickOnTypeSelection('Article');
  });

  // Test CMDI input field
  it('should be visible Has CMDI file input field because user is admin', {
      retries: {
        runMode: 6,
        openMode: 6,
      },
      defaultCommandTimeout: 10000
    },() => {
    createItemProcess.checkLocalHasCMDIVisibility();
  });

  it('The local.hasCMDI value should be sent in the response after type change', {
      retries: {
        runMode: 6,
        openMode: 6,
      },
      defaultCommandTimeout: 10000
    },() => {
    createItemProcess.clickOnSelectionInput('dc.type');
    createItemProcess.clickOnTypeSelection('Article');
    createItemProcess.checkCheckbox('local_hasCMDI');
    createItemProcess.controlCheckedCheckbox('local_hasCMDI',true);
    createItemProcess.clickOnSave();
    cy.reload();
    createItemProcess.controlCheckedCheckbox('local_hasCMDI',true);
  });

  it('should change the step status after accepting/declining the distribution license', {
    retries: {
      runMode: 6,
      openMode: 6,
    },
    defaultCommandTimeout: 10000
  },() => {
    createItemProcess.checkDistributionLicenseStep();
    createItemProcess.checkDistributionLicenseToggle();
    // default status value is warnings
    createItemProcess.checkDistributionLicenseStatus('Warnings');
    // accept the distribution license agreement
    createItemProcess.clickOnDistributionLicenseToggle();
    // after accepting the status should be valid
    createItemProcess.checkDistributionLicenseStatus('Valid');
    // click on the toggle again and status should be changed to `Warnings`
    createItemProcess.clickOnDistributionLicenseToggle();
    createItemProcess.checkDistributionLicenseStatus('Warnings');
  });

  it('should pick up the license from the license selector', {
    retries: {
      runMode: 6,
      openMode: 6,
    },
    defaultCommandTimeout: 10000
  },() => {
    createItemProcess.checkLicenseResourceStep();
    // check default value in the license dropdown selection
    createItemProcess.checkLicenseSelectionValue('Select a License ...');
    // pop up the license selector modal
    createItemProcess.clickOnLicenseSelectorButton();
    // check if the modal was popped up
    createItemProcess.checkLicenseSelectorModal();
    // pick up the first license from the modal, it is `Public Domain Mark (PD)`
    createItemProcess.pickUpLicenseFromLicenseSelector();
    // check if the picked up license value is seen as selected value in the selection
    createItemProcess.checkLicenseSelectionValue('Public Domain Mark (PD)');
  });

  it('should select the license from the license selection dropdown and change status', {
    retries: {
      runMode: 6,
      openMode: 6,
    },
    defaultCommandTimeout: 10000
  },() => {
    createItemProcess.checkLicenseResourceStep();
    // check default value in the license dropdown selection
    createItemProcess.checkLicenseSelectionValue('Select a License ...');
    // check step status - it should be as warning
    createItemProcess.checkResourceLicenseStatus('Warnings');
    // click on the dropdown button to list options
    createItemProcess.clickOnLicenseSelectionButton();
    // select `Public Domain Mark (PD)` from the selection
    createItemProcess.selectValueFromLicenseSelection(2);
    // // selected value should be seen as selected value in the selection
    createItemProcess.checkLicenseSelectionValue('GNU General Public License, version 2');
    // // check step status - it should be valid
    createItemProcess.checkResourceLicenseStatus('Valid');
  });

  it('should show warning messages if was selected non-supported license', {
    retries: {
      runMode: 6,
      openMode: 6,
    },
    defaultCommandTimeout: 10000
  },() => {
    createItemProcess.checkLicenseResourceStep();
    // check default value in the license dropdown selection
    createItemProcess.checkLicenseSelectionValue('Select a License ...');
    // check step status - it should be as warning
    createItemProcess.checkResourceLicenseStatus('Warnings');
    // click on the dropdown button to list options
    createItemProcess.clickOnLicenseSelectionButton();
    // select `Select a License ...` from the selection - this license is not supported
    createItemProcess.selectValueFromLicenseSelection(0);
    // selected value should be seen as selected value in the selection
    createItemProcess.checkLicenseSelectionValue('Select a License ...');
    // check step status - it should an error
    createItemProcess.checkResourceLicenseStatus('Errors');
    // error messages should be popped up
    createItemProcess.showErrorMustChooseLicense();
    createItemProcess.showErrorNotSupportedLicense();
  });

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

  it('The submission should not have the Notice Step', {
    retries: {
      runMode: 6,
      openMode: 6,
    },
    defaultCommandTimeout: 10000
  },() => {
    createItemProcess.checkClarinNoticeStepNotExist();
  });
});

describe('Create a new submission in the clariah collection', () => {
  beforeEach(() => {
    // Create a new submission
    cy.visit('/submit?collection=' + TEST_SUBMIT_CLARIAH_COLLECTION_UUID + '&entityType=none');

    // This page is restricted, so we will be shown the login form. Fill it out & submit.
    cy.loginViaForm(TEST_ADMIN_USER, TEST_ADMIN_PASSWORD);
  });

  it('The submission should have the Notice Step', {
    retries: {
      runMode: 6,
      openMode: 6,
    },
    defaultCommandTimeout: 10000
  },() => {
    createItemProcess.checkClarinNoticeStep();
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
