import { Component } from '@angular/core';
import {
  rendersAdvancedWorkflowTaskOption
} from '../../../shared/mydspace-actions/claimed-task/switcher/claimed-task-actions-decorator';

export const ADVANCED_WORKFLOW_ACTION_RATING_REVIEWER = 'ratingrevieweraction';

@rendersAdvancedWorkflowTaskOption(ADVANCED_WORKFLOW_ACTION_RATING_REVIEWER)
@Component({
  selector: 'ds-advanced-workflow-action-rating-reviewer',
  templateUrl: './advanced-workflow-action-rating-reviewer.component.html',
  styleUrls: ['./advanced-workflow-action-rating-reviewer.component.scss']
})
export class AdvancedWorkflowActionRatingReviewerComponent {
}
