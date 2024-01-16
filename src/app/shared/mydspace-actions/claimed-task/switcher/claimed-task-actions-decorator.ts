import { hasNoValue } from '../../../empty.util';
import {
  ClaimedTaskActionsApproveComponent,
  WORKFLOW_TASK_OPTION_APPROVE
} from '../approve/claimed-task-actions-approve.component';
import {
  ClaimedTaskActionsDeclineTaskComponent,
  WORKFLOW_TASK_OPTION_DECLINE_TASK
} from '../decline-task/claimed-task-actions-decline-task.component';
import {
  ClaimedTaskActionsEditMetadataComponent,
  WORKFLOW_TASK_OPTION_EDIT_METADATA
} from '../edit-metadata/claimed-task-actions-edit-metadata.component';
import {
  ADVANCED_WORKFLOW_TASK_OPTION_RATING,
  AdvancedWorkflowActionRatingComponent
} from '../../../../workflowitems-edit-page/advanced-workflow-action/advanced-workflow-action-rating/advanced-workflow-action-rating.component';
import { AdvancedClaimedTaskActionRatingComponent } from '../rating/advanced-claimed-task-action-rating.component';
import {
  ClaimedTaskActionsRejectComponent,
  WORKFLOW_TASK_OPTION_REJECT
} from '../reject/claimed-task-actions-reject.component';
import {
  ClaimedTaskActionsReturnToPoolComponent,
  WORKFLOW_TASK_OPTION_RETURN_TO_POOL
} from '../return-to-pool/claimed-task-actions-return-to-pool.component';
import {
  ADVANCED_WORKFLOW_TASK_OPTION_SELECT_REVIEWER,
  AdvancedWorkflowActionSelectReviewerComponent
} from '../../../../workflowitems-edit-page/advanced-workflow-action/advanced-workflow-action-select-reviewer/advanced-workflow-action-select-reviewer.component';
import {
  AdvancedClaimedTaskActionSelectReviewerComponent
} from '../select-reviewer/advanced-claimed-task-action-select-reviewer.component';

const workflowOptions = new Map();
const advancedWorkflowOptions = new Map();

workflowOptions.set(WORKFLOW_TASK_OPTION_APPROVE, ClaimedTaskActionsApproveComponent);
workflowOptions.set(WORKFLOW_TASK_OPTION_DECLINE_TASK, ClaimedTaskActionsDeclineTaskComponent);
workflowOptions.set(WORKFLOW_TASK_OPTION_EDIT_METADATA, ClaimedTaskActionsEditMetadataComponent);
workflowOptions.set(ADVANCED_WORKFLOW_TASK_OPTION_RATING, AdvancedClaimedTaskActionRatingComponent);
workflowOptions.set(WORKFLOW_TASK_OPTION_REJECT, ClaimedTaskActionsRejectComponent);
workflowOptions.set(WORKFLOW_TASK_OPTION_RETURN_TO_POOL, ClaimedTaskActionsReturnToPoolComponent);
workflowOptions.set(ADVANCED_WORKFLOW_TASK_OPTION_SELECT_REVIEWER, AdvancedClaimedTaskActionSelectReviewerComponent);

advancedWorkflowOptions.set(ADVANCED_WORKFLOW_TASK_OPTION_RATING, AdvancedWorkflowActionRatingComponent);
advancedWorkflowOptions.set(ADVANCED_WORKFLOW_TASK_OPTION_SELECT_REVIEWER, AdvancedWorkflowActionSelectReviewerComponent);

/**
 * Decorator used for rendering ClaimedTaskActions pages by option type
 */
export function rendersWorkflowTaskOption(option: string) {
  return function decorator(component: any) {
    if (hasNoValue(workflowOptions.get(option))) {
      workflowOptions.set(option, component);
    } else {
      throw new Error(`There can't be more than one component to render ClaimedTaskActions for option "${option}"`);
    }
  };
}

/**
 * Decorator used for rendering AdvancedClaimedTaskActions pages by option type
 */
export function rendersAdvancedWorkflowTaskOption(option: string) {
  return function decorator(component: any) {
    if (hasNoValue(advancedWorkflowOptions.get(option))) {
      advancedWorkflowOptions.set(option, component);
    } else {
      throw new Error(`There can't be more than one component to render AdvancedClaimedTaskActions for option "${option}"`);
    }
  };
}

/**
 * Get the component used for rendering a ClaimedTaskActions page by option type
 */
export function getComponentByWorkflowTaskOption(option: string) {
  return workflowOptions.get(option);
}

/**
 * Get the component used for rendering a AdvancedClaimedTaskActions page by option type
 */
export function getAdvancedComponentByWorkflowTaskOption(option: string) {
  return advancedWorkflowOptions.get(option);
}
