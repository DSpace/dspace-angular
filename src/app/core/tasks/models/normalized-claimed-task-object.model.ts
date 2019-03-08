import { NormalizedTaskObject } from './normalized-task-object.model';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { autoserialize, inheritSerialization } from 'cerialize';
import { ClaimedTask } from './claimed-task-object.model';
import { ResourceType } from '../../shared/resource-type';

/**
 * A model class for a NormalizedClaimedTaskObject.
 */
@mapsTo(ClaimedTask)
@inheritSerialization(NormalizedTaskObject)
export class NormalizedClaimedTask extends NormalizedTaskObject {

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
