import { NormalizedTaskObject } from './normalized-task-object.model';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { autoserialize, inheritSerialization } from 'cerialize';
import { ClaimedTask } from './claimed-task-object.model';
import { EPerson } from '../../eperson/models/eperson.model';
import { Group } from '../../eperson/models/group.model';
import { WorkflowItem } from '../../submission/models/workflowitem.model';

/**
 * A normalized model class for a ClaimedTask.
 */
@mapsTo(ClaimedTask)
@inheritSerialization(NormalizedTaskObject)
export class NormalizedClaimedTask extends NormalizedTaskObject<ClaimedTask> {
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
   * The eperson object for this task
   */
  @autoserialize
  @relationship(EPerson, false)
  eperson: string;

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
