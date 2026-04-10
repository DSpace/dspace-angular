import {
  ADVANCED_WORKFLOW_ACTION_RATING,
  ADVANCED_WORKFLOW_TASK_OPTION_RATING,
  AdvancedWorkflowActionRatingComponent,
} from '../../../../workflowitems-edit-page/advanced-workflow-action/advanced-workflow-action-rating/advanced-workflow-action-rating.component';
import {
  ADVANCED_WORKFLOW_ACTION_SELECT_REVIEWER,
  ADVANCED_WORKFLOW_TASK_OPTION_SELECT_REVIEWER,
  AdvancedWorkflowActionSelectReviewerComponent,
} from '../../../../workflowitems-edit-page/advanced-workflow-action/advanced-workflow-action-select-reviewer/advanced-workflow-action-select-reviewer.component';
import { hasNoValue } from '../../../empty.util';
import {
  ClaimedTaskActionsApproveComponent,
  WORKFLOW_TASK_OPTION_APPROVE,
} from '../approve/claimed-task-actions-approve.component';
import {
  ClaimedTaskActionsDeclineTaskComponent,
  WORKFLOW_TASK_OPTION_DECLINE_TASK,
} from '../decline-task/claimed-task-actions-decline-task.component';
import {
  ClaimedTaskActionsEditMetadataComponent,
  WORKFLOW_TASK_OPTION_EDIT_METADATA,
} from '../edit-metadata/claimed-task-actions-edit-metadata.component';
import { AdvancedClaimedTaskActionRatingComponent } from '../rating/advanced-claimed-task-action-rating.component';
import {
  ClaimedTaskActionsRejectComponent,
  WORKFLOW_TASK_OPTION_REJECT,
} from '../reject/claimed-task-actions-reject.component';
import {
  ClaimedTaskActionsReturnToPoolComponent,
  WORKFLOW_TASK_OPTION_RETURN_TO_POOL,
} from '../return-to-pool/claimed-task-actions-return-to-pool.component';
import { AdvancedClaimedTaskActionSelectReviewerComponent } from '../select-reviewer/advanced-claimed-task-action-select-reviewer.component';

export type WorkflowTaskOptionComponent =
  typeof ClaimedTaskActionsApproveComponent |
  typeof ClaimedTaskActionsDeclineTaskComponent |
  typeof ClaimedTaskActionsEditMetadataComponent |
  typeof AdvancedClaimedTaskActionRatingComponent |
  typeof ClaimedTaskActionsRejectComponent |
  typeof ClaimedTaskActionsReturnToPoolComponent |
  typeof AdvancedClaimedTaskActionSelectReviewerComponent;

export type AdvancedWorkflowTaskOptionComponent =
  typeof AdvancedWorkflowActionRatingComponent |
  typeof AdvancedWorkflowActionSelectReviewerComponent;

export const WORKFLOW_TASK_OPTION_DECORATOR_MAP = new Map<string, WorkflowTaskOptionComponent>([
  [WORKFLOW_TASK_OPTION_APPROVE, ClaimedTaskActionsApproveComponent],
  [WORKFLOW_TASK_OPTION_DECLINE_TASK, ClaimedTaskActionsDeclineTaskComponent],
  [WORKFLOW_TASK_OPTION_EDIT_METADATA, ClaimedTaskActionsEditMetadataComponent],
  [ADVANCED_WORKFLOW_TASK_OPTION_RATING, AdvancedClaimedTaskActionRatingComponent],
  [WORKFLOW_TASK_OPTION_REJECT, ClaimedTaskActionsRejectComponent],
  [WORKFLOW_TASK_OPTION_RETURN_TO_POOL, ClaimedTaskActionsReturnToPoolComponent],
  [ADVANCED_WORKFLOW_TASK_OPTION_SELECT_REVIEWER, AdvancedClaimedTaskActionSelectReviewerComponent],
]);

export const ADVANCED_WORKFLOW_TASK_OPTION_DECORATOR_MAP = new Map<string, AdvancedWorkflowTaskOptionComponent>([
  [ADVANCED_WORKFLOW_ACTION_RATING, AdvancedWorkflowActionRatingComponent],
  [ADVANCED_WORKFLOW_ACTION_SELECT_REVIEWER, AdvancedWorkflowActionSelectReviewerComponent],
]);

/**
 * Decorator used for rendering ClaimedTaskActions pages by option type
 */
export function rendersWorkflowTaskOption(option: string) {
  return function decorator(component: any) {
    if (hasNoValue(WORKFLOW_TASK_OPTION_DECORATOR_MAP.get(option))) {
      WORKFLOW_TASK_OPTION_DECORATOR_MAP.set(option, component);
    } else {
      throw new Error(`There can't be more than one component to render ClaimedTaskActions for option "${option}"`);
    }
  };
}

/**
 * Decorator used for rendering AdvancedClaimedTaskActions pages by option type
 * @deprecated
 */
export function rendersAdvancedWorkflowTaskOption(option: string) {
  return function decorator(component: any) {
    if (hasNoValue(ADVANCED_WORKFLOW_TASK_OPTION_DECORATOR_MAP.get(option))) {
      ADVANCED_WORKFLOW_TASK_OPTION_DECORATOR_MAP.set(option, component);
    } else {
      throw new Error(`There can't be more than one component to render AdvancedClaimedTaskActions for option "${option}"`);
    }
  };
}

/**
 * Get the component used for rendering a ClaimedTaskActions page by option type
 */
export function getComponentByWorkflowTaskOption(option: string): WorkflowTaskOptionComponent {
  return WORKFLOW_TASK_OPTION_DECORATOR_MAP.get(option);
}

/**
 * Get the component used for rendering a AdvancedClaimedTaskActions page by option type
 */
export function getAdvancedComponentByWorkflowTaskOption(option: string): AdvancedWorkflowTaskOptionComponent {
  return ADVANCED_WORKFLOW_TASK_OPTION_DECORATOR_MAP.get(option);
}
