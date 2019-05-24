import { autoserialize, inheritSerialization } from 'cerialize';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { ResourceType } from '../../shared/resource-type';
import { NormalizedDSpaceObject } from '../../cache/models/normalized-dspace-object.model';
import { TaskObject } from './task-object.model';
import { DSpaceObject } from '../../shared/dspace-object.model';

/**
 * An abstract normalized model class for a TaskObject.
 */
@mapsTo(TaskObject)
@inheritSerialization(NormalizedDSpaceObject)
export abstract class NormalizedTaskObject<T extends DSpaceObject> extends NormalizedDSpaceObject<T> {

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
