/**
 * Enum representing the Action Type of a Resource Policy
 */
export enum ActionType {
  /**
   * Action of reading, viewing or downloading something
   */
  READ = 0,

  /**
   * Action of modifying something
   */
  WRITE = 1,

  /**
   * Action of deleting something
   */
  DELETE = 2,

  /**
   * Action of adding something to a container
   */
  ADD = 3,

  /**
   * Action of removing something from a container
   */
  REMOVE = 4,

  /**
   * Action of performing workflow step 1
   */
  WORKFLOW_STEP_1 = 5,

  /**
   * Action of performing workflow step 2
   */
  WORKFLOW_STEP_2 = 6,

  /**
   *  Action of performing workflow step 3
   */
  WORKFLOW_STEP_3 = 7,

  /**
   *  Action of performing a workflow abort
   */
  WORKFLOW_ABORT = 8,

  /**
   * Default Read policies for Bitstreams submitted to container
   */
  DEFAULT_BITSTREAM_READ = 9,

  /**
   *  Default Read policies for Items submitted to container
   */
  DEFAULT_ITEM_READ = 10,

  /**
   * Administrative actions
   */
  ADMIN = 11,
}
