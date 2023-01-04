import { Component } from '@angular/core';
import {
  rendersAdvancedWorkflowTaskOption
} from '../../../shared/mydspace-actions/claimed-task/switcher/claimed-task-actions-decorator';
import { AdvancedWorkflowActionComponent } from '../advanced-workflow-action/advanced-workflow-action.component';

export const ADVANCED_WORKFLOW_ACTION_SELECT_REVIEWER = 'selectrevieweraction';

@rendersAdvancedWorkflowTaskOption(ADVANCED_WORKFLOW_ACTION_SELECT_REVIEWER)
@Component({
  selector: 'ds-advanced-workflow-action-select-reviewer',
  templateUrl: './advanced-workflow-action-select-reviewer.component.html',
  styleUrls: ['./advanced-workflow-action-select-reviewer.component.scss'],
})
export class AdvancedWorkflowActionSelectReviewerComponent extends AdvancedWorkflowActionComponent {
}
