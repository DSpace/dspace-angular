/**
 * This enumeration represents all possible ways of representing a group of objects in the UI
 */

export enum Context {
  /** Default context */
  Any = 'undefined',

  /** General item page context */
  ItemPage = 'itemPage',

  /** General search page context */
  Search = 'search',

  Workflow = 'workflow',
  Workspace = 'workspace',
  SupervisedItems = 'supervisedWorkspace',

  /** Administrative menu context */
  AdminMenu = 'adminMenu',

  EntitySearchModalWithNameVariants = 'EntitySearchModalWithNameVariants',
  EntitySearchModal = 'EntitySearchModal',

  /** Administrative search page context */
  AdminSearch = 'adminSearch',
  AdminWorkflowSearch = 'adminWorkflowSearch',

  SideBarSearchModal = 'sideBarSearchModal',
  SideBarSearchModalCurrent = 'sideBarSearchModalCurrent',

  /** The MyDSpace* Context values below are used for badge display in MyDSpace. */
  MyDSpaceArchived = 'mydspaceArchived',
  MyDSpaceWorkspace = 'mydspaceWorkspace',
  MyDSpaceWorkflow = 'mydspaceWorkflow',
  MyDSpaceDeclined = 'mydspaceDeclined',
  MyDSpaceApproved = 'mydspaceApproved',
  MyDSpaceWaitingController = 'mydspaceWaitingController',
  MyDSpaceValidation = 'mydspaceValidation',

  Bitstream = 'bitstream',
}
