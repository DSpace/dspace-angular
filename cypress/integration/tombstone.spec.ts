import {
  TEST_ADMIN_PASSWORD,
  TEST_ADMIN_USER,
  TEST_WITHDRAWN_AUTHORS,
  TEST_WITHDRAWN_ITEM,
  TEST_WITHDRAWN_ITEM_WITH_REASON, TEST_WITHDRAWN_ITEM_WITH_REASON_AND_AUTHORS, TEST_WITHDRAWN_REASON,
  TEST_WITHDRAWN_REPLACED_ITEM, TEST_WITHDRAWN_REPLACED_ITEM_WITH_AUTHORS, TEST_WITHDRAWN_REPLACEMENT
} from '../support';

const ITEMPAGE_WITHDRAWN = '/items/' + TEST_WITHDRAWN_ITEM;
const ITEMPAGE_WITHDRAWN_REASON = '/items/' + TEST_WITHDRAWN_ITEM_WITH_REASON;
const ITEMPAGE_WITHDRAWN_REPLACED = '/items/' + TEST_WITHDRAWN_REPLACED_ITEM;
const ITEMPAGE_WITHDRAWN_REASON_AUTHORS = '/items/' + TEST_WITHDRAWN_ITEM_WITH_REASON_AND_AUTHORS;
const ITEMPAGE_WITHDRAWN_REPLACED_AUTHORS = '/items/' + TEST_WITHDRAWN_REPLACED_ITEM_WITH_AUTHORS;
const TOMBSTONED_ITEM_MESSAGE = 'This item has been withdrawn';

// describe('Tombstone  Page', () => {
//
//   it('should see the items page the item must exists', () => {
//     cy.visit(ITEMPAGE_WITHDRAWN);
//     // <ds-item-page> tag must be loaded
//     cy.get('ds-item-page').should('exist');
//
//     cy.visit(ITEMPAGE_WITHDRAWN_REASON);
//     // <ds-item-page> tag must be loaded
//     cy.get('ds-item-page').should('exist');
//
//     cy.visit(ITEMPAGE_WITHDRAWN_REPLACED);
//     // <ds-item-page> tag must be loaded
//     cy.get('ds-item-page').should('exist');
//   });
//
//   it('the user should see withdrawn tombstone', () => {
//     cy.visit(ITEMPAGE_WITHDRAWN);
//     cy.get('ds-withdrawn-tombstone').should('exist');
//     cy.get('ds-replaced-tombstone').should('not.exist');
//     cy.get('ds-view-tracker').should('not.exist');
//   });
//
//   it('the user should see withdrawn tombstone with the reason', () => {
//     cy.visit(ITEMPAGE_WITHDRAWN_REASON);
//     cy.get('ds-withdrawn-tombstone').contains(TEST_WITHDRAWN_REASON);
//   });
//
//   it('the user should see replacement tombstone with the new destination', () => {
//     cy.visit(ITEMPAGE_WITHDRAWN_REPLACED);
//     cy.get('ds-replaced-tombstone').contains(TEST_WITHDRAWN_REPLACEMENT);
//   });
//
//   it('the user should see withdrawn tombstone with the reason and with authors', () => {
//     cy.visit(ITEMPAGE_WITHDRAWN_REASON_AUTHORS);
//     cy.get('ds-withdrawn-tombstone').contains(TEST_WITHDRAWN_AUTHORS);
//   });
//
//   it('the user should see replacement tombstone with the new destination and with the authors', () => {
//     cy.visit(ITEMPAGE_WITHDRAWN_REPLACED_AUTHORS);
//     cy.get('ds-replaced-tombstone').contains(TEST_WITHDRAWN_AUTHORS);
//   });
//
// });

describe('Admin Tombstone  Page', () => {
  beforeEach(() => {
    cy.visit('/login');
    // Cancel discojuice login - only if it is popped up
    cy.wait(500);
    cy.get('.discojuice_close').should('exist').click();
    // Login as admin
    cy.loginViaForm(TEST_ADMIN_USER, TEST_ADMIN_PASSWORD);
    cy.visit('/');
  });

  it('the admin should see ds-item-page',{
      retries: {
        runMode: 8,
        openMode: 8,
      },
      defaultCommandTimeout: 10000
    }, () => {
    cy.visit(ITEMPAGE_WITHDRAWN);
    cy.get('ds-item-page').should('exist');
  });

  it('the admin should see the withdrawn message on the replaced item', {
      retries: {
        runMode: 8,
        openMode: 8,
      },
    defaultCommandTimeout: 10000
    }, () => {
    cy.visit(ITEMPAGE_WITHDRAWN_REPLACED);
    cy.get('ds-item-page').contains(TOMBSTONED_ITEM_MESSAGE);
  });

});
