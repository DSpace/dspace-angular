import {
  ClaimedTaskActionsDeclineTaskComponent
} from '../shared/mydspace-actions/claimed-task/decline-task/claimed-task-actions-decline-task.component';
import {
  AdvancedClaimedTaskActionSelectReviewerComponent
} from '../shared/mydspace-actions/claimed-task/select-reviewer/advanced-claimed-task-action-select-reviewer.component';
import {
  AdvancedClaimedTaskActionRatingComponent
} from '../shared/mydspace-actions/claimed-task/rating/advanced-claimed-task-action-rating.component';


/**
 * Declaration needed to make sure all decorator functions are called in time
 */
export const workflowTasks =
  [
    AdvancedClaimedTaskActionRatingComponent,
    AdvancedClaimedTaskActionSelectReviewerComponent,
    ClaimedTaskActionsDeclineTaskComponent,
  ];
