import { NormalizedTaskObject } from './normalized-task-object.model';
import { PoolTask } from './pool-task-object.model';
import { autoserialize, inheritSerialization } from 'cerialize';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { Group } from '../../eperson/models/group.model';
import { WorkflowItem } from '../../submission/models/workflowitem.model';

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
   * The group object for this task
   */
  @autoserialize
  @relationship(Group, false)
  group: string;

  /**
   * The workflowitem object whom this task is related
   */
  @autoserialize
  @relationship(WorkflowItem, false)
  workflowitem: string;
}
