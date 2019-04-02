import { NormalizedTaskObject } from './normalized-task-object.model';
import { PoolTask } from './pool-task-object.model';
import { autoserialize, inheritSerialization } from 'cerialize';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { ResourceType } from '../../shared/resource-type';

/**
 * A normalized model class for a PoolTask.
 */
@mapsTo(PoolTask)
@inheritSerialization(NormalizedTaskObject)
export class NormalizedPoolTask extends NormalizedTaskObject<PoolTask> {

  /**
   * The task identifier
   */
  @autoserialize
  id: string;

  /**
   * The workflow step
   */
  @autoserialize
  step: string;

  /**
   * The task action type
   */
  @autoserialize
  action: string;

  /**
   * The workflowitem object whom this task is related
   */
  @autoserialize
  @relationship(ResourceType.Workflowitem, false)
  workflowitem: string;
}
