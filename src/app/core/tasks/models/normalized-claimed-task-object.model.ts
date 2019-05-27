import { NormalizedTaskObject } from './normalized-task-object.model';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { autoserialize, inheritSerialization } from 'cerialize';
import { ClaimedTask } from './claimed-task-object.model';
import { ResourceType } from '../../shared/resource-type';
import { resourceType } from '../../shared/resource-type.decorator';

/**
 * A normalized model class for a ClaimedTask.
 */
@mapsTo(ClaimedTask)
@resourceType(ResourceType.ClaimedTask)
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
  @relationship(ResourceType.EPerson, false)
  eperson: string;

  /**
   * The group object for this task
   */
  @autoserialize
  @relationship(ResourceType.Group, false)
  group: string;

  /**
   * The workflowitem object whom this task is related
   */
  @autoserialize
  @relationship(ResourceType.WorkflowItem, false)
  workflowitem: string;

}
