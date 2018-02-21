import { NormalizedTaskObject } from './normalized-task-object.model';
import { NormalizedDSpaceObject } from '../../../cache/models/normalized-dspace-object.model';
import { PoolTask } from './pool-task-object.model';
import { inheritSerialization } from 'cerialize';
import { mapsTo } from '../../../cache/builders/build-decorators';

/**
 * A model class for a NormalizedClaimedtaskObject.
 */
@mapsTo(PoolTask)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedPoolTask extends NormalizedTaskObject {

}
