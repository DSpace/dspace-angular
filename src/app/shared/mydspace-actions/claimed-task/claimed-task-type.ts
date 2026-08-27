/**
 * Enum containing all possible advanced claimed task types.
 */
export enum ClaimedTaskType {
  WORKFLOW_TASK_OPTION_APPROVE = 'submit_approve',
  WORKFLOW_TASK_OPTION_DECLINE_TASK = 'submit_decline_task',
  WORKFLOW_TASK_OPTION_EDIT_METADATA = 'submit_edit_metadata',
  ADVANCED_WORKFLOW_TASK_OPTION_RATING = 'submit_score',
  WORKFLOW_TASK_OPTION_REJECT = 'submit_reject',
  WORKFLOW_TASK_OPTION_RETURN_TO_POOL = 'return_to_pool',
  ADVANCED_WORKFLOW_TASK_OPTION_SELECT_REVIEWER = 'submit_select_reviewer',
}
