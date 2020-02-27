/**
 * An enum listing all possible workflow task options
 * Used to render components for the options and building request bodies
 */
export enum WorkflowTaskOptions {
  Approve = 'submit_approve',
  Reject = 'submit_reject',
  EditMetadata = 'submit_edit_metadata',
  ReturnToPool = 'return_to_pool'
}
