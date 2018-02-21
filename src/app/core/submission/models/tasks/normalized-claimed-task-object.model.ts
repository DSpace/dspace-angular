import { NormalizedTaskObject } from './normalized-task-object.model';
import { ClaimedTask } from './claimed-task-object.model';
import { mapsTo } from '../../../cache/builders/build-decorators';
import { inheritSerialization } from 'cerialize';
import { NormalizedDSpaceObject } from '../../../cache/models/normalized-dspace-object.model';

/**
 * A model class for a NormalizedClaimedtaskObject.
 */
@mapsTo(ClaimedTask)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedClaimedTask extends NormalizedTaskObject {

}
