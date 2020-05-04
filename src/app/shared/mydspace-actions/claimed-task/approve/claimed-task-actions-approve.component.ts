import { Component } from '@angular/core';
import { ClaimedTaskActionsAbstractComponent } from '../abstract/claimed-task-actions-abstract.component';
import { rendersWorkflowTaskOption } from '../switcher/claimed-task-actions-decorator';
import { ClaimedTaskDataService } from '../../../../core/tasks/claimed-task-data.service';

export const WORKFLOW_TASK_OPTION_APPROVE = 'submit_approve';

@rendersWorkflowTaskOption(WORKFLOW_TASK_OPTION_APPROVE)
@Component({
  selector: 'ds-claimed-task-actions-approve',
  styleUrls: ['./claimed-task-actions-approve.component.scss'],
  templateUrl: './claimed-task-actions-approve.component.html',
})
/**
 * Component for displaying and processing the approve action on a workflow task item
 */
export class ClaimedTaskActionsApproveComponent extends ClaimedTaskActionsAbstractComponent {
  /**
   * This component represents the approve option
   */
  option = WORKFLOW_TASK_OPTION_APPROVE;

  constructor(protected claimedTaskService: ClaimedTaskDataService) {
    super(claimedTaskService);
  }
}
