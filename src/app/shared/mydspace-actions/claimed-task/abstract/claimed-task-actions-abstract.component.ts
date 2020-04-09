import { EventEmitter, Input, Output } from '@angular/core';
import { ClaimedTask } from '../../../../core/tasks/models/claimed-task-object.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ClaimedTaskDataService } from '../../../../core/tasks/claimed-task-data.service';
import { ProcessTaskResponse } from '../../../../core/tasks/models/process-task-response';

/**
 * Abstract component for rendering a claimed task's action
 * To create a child-component for a new option:
 * - Set the "option" of the component
 * - Add a @rendersWorkflowTaskOption annotation to your component providing the same enum value
 * - Optionally overwrite createBody if the request body requires more than just the option
 */
export abstract class ClaimedTaskActionsAbstractComponent {
  /**
   * The workflow task option the child component represents
   */
  abstract option: string;

  /**
   * The Claimed Task to display an action for
   */
  @Input() object: ClaimedTask;

  /**
   * Emits the success or failure of a processed action
   */
  @Output() processCompleted: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * A boolean representing if the operation is pending
   */
  processing$ = new BehaviorSubject<boolean>(false);

  constructor(protected claimedTaskService: ClaimedTaskDataService) {
  }

  /**
   * Create a request body for submitting the task
   * Overwrite this method in the child component if the body requires more than just the option
   */
  createbody(): any {
    return {
      [this.option]: 'true'
    };
  }

  /**
   * Submit the task for this option
   * While the task is submitting, processing$ is set to true and processCompleted emits the response's status when
   * completed
   */
  submitTask() {
    this.processing$.next(true);
    this.claimedTaskService.submitTask(this.object.id, this.createbody())
      .subscribe((res: ProcessTaskResponse) => {
        this.processing$.next(false);
        this.processCompleted.emit(res.hasSucceeded);
      });
  }
}
