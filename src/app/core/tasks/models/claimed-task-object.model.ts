import { CLAIMED_TASK } from './claimed-task-object.resource-type';
import { TaskObject } from './task-object.model';

/**
 * A model class for a ClaimedTask.
 */
export class ClaimedTask extends TaskObject {
  static type = CLAIMED_TASK;
}
