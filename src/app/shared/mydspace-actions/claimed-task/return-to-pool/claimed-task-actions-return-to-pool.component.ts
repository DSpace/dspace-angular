import { Component } from '@angular/core';
import { ClaimedTaskActionsAbstractComponent } from '../abstract/claimed-task-actions-abstract.component';
import { rendersWorkflowTaskOption } from '../switcher/claimed-task-actions-decorator';
import { WorkflowTaskOptions } from '../workflow-task-options.model';
import { ClaimedTaskDataService } from '../../../../core/tasks/claimed-task-data.service';
import { ProcessTaskResponse } from '../../../../core/tasks/models/process-task-response';

@rendersWorkflowTaskOption(WorkflowTaskOptions.ReturnToPool)
@Component({
  selector: 'ds-claimed-task-actions-return-to-pool',
  styleUrls: ['./claimed-task-actions-return-to-pool.component.scss'],
  templateUrl: './claimed-task-actions-return-to-pool.component.html',
})
/**
 * Component for displaying and processing the return to pool action on a workflow task item
 */
export class ClaimedTaskActionsReturnToPoolComponent extends ClaimedTaskActionsAbstractComponent {
  /**
   * This component represents the edit metadata option
   */
  option = WorkflowTaskOptions.ReturnToPool;

  constructor(protected claimedTaskService: ClaimedTaskDataService) {
    super(claimedTaskService);
  }

  /**
   * Submit a return to pool option for the task
   */
  submitTask() {
    this.processing$.next(true);
    this.claimedTaskService.returnToPoolTask(this.object.id)
      .subscribe((res: ProcessTaskResponse) => {
        this.processing$.next(false);
        this.processCompleted.emit(res.hasSucceeded);
      });
  }
}
