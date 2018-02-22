import { autoserialize, inheritSerialization } from 'cerialize';
import { mapsTo, relationship } from '../../../cache/builders/build-decorators';
import { ResourceType } from '../../../shared/resource-type';
import { NormalizedDSpaceObject } from '../../../cache/models/normalized-dspace-object.model';
import { TaskObject } from './task-object.model';

/**
 * An abstract model class for a DSpaceObject.
 */
@mapsTo(TaskObject)
@inheritSerialization(NormalizedDSpaceObject)
export abstract class NormalizedTaskObject extends NormalizedDSpaceObject {

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
