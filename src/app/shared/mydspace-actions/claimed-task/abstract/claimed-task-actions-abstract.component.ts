import { EventEmitter, Input, Output } from '@angular/core';
import { ClaimedTask } from '../../../../core/tasks/models/claimed-task-object.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

/**
 * Abstract component for rendering a claimed task's action
 */
export abstract class ClaimedTaskActionsAbstractComponent {
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

  /**
   * Method called when the action's button is clicked
   */
  abstract process();
}
