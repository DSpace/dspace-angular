import { TaskObject } from './task-object.model';
import { ResourceType } from '../../shared/resource-type';

/**
 * A model class for a ClaimedTask.
 */
export class ClaimedTask extends TaskObject {
  static type = new ResourceType('claimedtask');
}
