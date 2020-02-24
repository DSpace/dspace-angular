import { Component } from '@angular/core';
import { ProcessTaskResponse } from '../../../../core/tasks/models/process-task-response';
import { ClaimedTaskActionsAbstractComponent } from '../abstract/claimed-task-actions-abstract.component';
import { rendersWorkflowTaskOption } from '../switcher/claimed-task-actions-decorator';
import { ClaimedTaskDataService } from '../../../../core/tasks/claimed-task-data.service';

export const WORKFLOW_TASK_OPTION_RETURN = 'return_to_pool';

@rendersWorkflowTaskOption(WORKFLOW_TASK_OPTION_RETURN)
@Component({
  selector: 'ds-claimed-task-actions-return-to-pool',
  styleUrls: ['./claimed-task-actions-return-to-pool.component.scss'],
  templateUrl: './claimed-task-actions-return-to-pool.component.html',
})
/**
 * Component for displaying and processing the return to pool action on a workflow task item
 */
export class ClaimedTaskActionsReturnToPoolComponent extends ClaimedTaskActionsAbstractComponent {

  constructor(protected claimedTaskService: ClaimedTaskDataService) {
    super();
  }

  /**
   * Return task to pool
   */
  process() {
    this.processing$.next(true);
    this.claimedTaskService.returnToPoolTask(this.object.id)
      .subscribe((res: ProcessTaskResponse) => {
        this.processing$.next(false);
        this.processCompleted.emit(res.hasSucceeded);
      });
  }
}
