// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// When a command from ./commands is ready to use, import with `import './commands'` syntax
// import './commands';

// Import Cypress Axe tools for all tests
// https://github.com/component-driven/cypress-axe
import 'cypress-axe';

// Global constants used in tests
export const TEST_COLLECTION = '282164f5-d325-4740-8dd1-fa4d6d3e7200';
export const TEST_COMMUNITY = '0958c910-2037-42a9-81c7-dca80e3892b4';
export const TEST_ENTITY_PUBLICATION = 'e98b0f27-5c19-49a0-960d-eb6ad5287067';

export const TEST_WITHDRAWN_ITEM = '921d256f-c64f-438e-b17e-13fb75a64e19';
export const TEST_WITHDRAWN_ITEM_WITH_REASON = 'ce6ceeb4-8f47-4d5a-ad22-e87b3110cc04';
export const TEST_WITHDRAWN_ITEM_WITH_REASON_AND_AUTHORS = 'ad27520a-98c0-40a4-bfc3-2edd857b3418';
export const TEST_WITHDRAWN_REPLACED_ITEM = '94c48fc7-0425-48dc-9be6-7e7087534a3d';
export const TEST_WITHDRAWN_REPLACED_ITEM_WITH_AUTHORS = '0e9ef1cb-5b9f-4acc-a7ca-5a9a66a6ddbd';

export const TEST_WITHDRAWN_REASON = 'reason';
export const TEST_WITHDRAWN_REPLACEMENT = 'new URL';
export const TEST_WITHDRAWN_AUTHORS = 'author1, author2';

