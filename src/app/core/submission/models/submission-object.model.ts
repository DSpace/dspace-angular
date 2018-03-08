import { CacheableObject } from '../../cache/object-cache.reducer';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { DSpaceObject } from '../../shared/dspace-object.model';

/**
 * An abstract model class for a DSpaceObject.
 */
export abstract class SubmissionObject extends DSpaceObject implements CacheableObject, ListableObject {

}
