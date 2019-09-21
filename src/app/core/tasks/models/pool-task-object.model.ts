import { TaskObject } from './task-object.model';
import { ResourceType } from '../../shared/resource-type';

/**
 * A model class for a PoolTask.
 */
export class PoolTask extends TaskObject {
  static type = new ResourceType('pooltask');
}
