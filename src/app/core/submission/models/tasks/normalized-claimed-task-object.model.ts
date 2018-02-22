import { NormalizedTaskObject } from './normalized-task-object.model';
import { mapsTo, relationship } from '../../../cache/builders/build-decorators';
import { autoserialize, inheritSerialization } from 'cerialize';
import { Workflowitem } from '../workflowitem.model';
import { RemoteData } from '../../../data/remote-data';
import { Observable } from 'rxjs/Observable';
import { ClaimedTask } from './claimed-task-object.model';
import { ResourceType } from '../../../shared/resource-type';
import { NormalizedDSpaceObject } from '../../../cache/models/normalized-dspace-object.model';

/**
 * A model class for a NormalizedClaimedtaskObject.
 */
@mapsTo(ClaimedTask)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedClaimedTask extends NormalizedDSpaceObject {

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
