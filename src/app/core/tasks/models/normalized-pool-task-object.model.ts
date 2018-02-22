import { NormalizedTaskObject } from './normalized-task-object.model';
import { PoolTask } from './pool-task-object.model';
import { autoserialize, inheritSerialization } from 'cerialize';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { NormalizedDSpaceObject } from '../../cache/models/normalized-dspace-object.model';
import { ResourceType } from '../../shared/resource-type';

/**
 * A model class for a NormalizedPoolTaskObject.
 */
@mapsTo(PoolTask)
@inheritSerialization(NormalizedTaskObject)
export class NormalizedPoolTask extends NormalizedTaskObject {

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

  @autoserialize
  @relationship(ResourceType.Workflowitem, true)
  workflowitem: string[];
}
