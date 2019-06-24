import { autoserialize, inheritSerialization } from 'cerialize';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { NormalizedDSpaceObject } from '../../cache/models/normalized-dspace-object.model';
import { TaskObject } from './task-object.model';
import { DSpaceObject } from '../../shared/dspace-object.model';
import { Group } from '../../eperson/models/group.model';
import { EPerson } from '../../eperson/models/eperson.model';
import { WorkflowItem } from '../../submission/models/workflowitem.model';

/**
 * An abstract normalized model class for a TaskObject.
 */
@mapsTo(TaskObject)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedTaskObject<T extends DSpaceObject> extends NormalizedDSpaceObject<T> {

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
