import { NormalizedTaskObject } from './normalized-task-object.model';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { autoserialize, inheritSerialization } from 'cerialize';
import { Workflowitem } from '../../submission/models/workflowitem.model';
import { RemoteData } from '../../data/remote-data';
import { Observable } from 'rxjs/Observable';
import { ClaimedTask } from './claimed-task-object.model';
import { ResourceType } from '../../shared/resource-type';
import { NormalizedDSpaceObject } from '../../cache/models/normalized-dspace-object.model';

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

  @autoserialize
  @relationship(ResourceType.Workflowitem, true)
  workflowitem: string[];
}
