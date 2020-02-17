import { inheritSerialization } from 'cerialize';
import { typedObject } from '../../cache/builders/build-decorators';
import { DSpaceObject } from '../../shared/dspace-object.model';
import { CLAIMED_TASK } from './claimed-task-object.resource-type';
import { TaskObject } from './task-object.model';

/**
 * A model class for a ClaimedTask.
 */
@typedObject
@inheritSerialization(DSpaceObject)
export class ClaimedTask extends TaskObject {
  static type = CLAIMED_TASK;
}
