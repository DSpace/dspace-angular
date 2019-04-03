import { DSpaceObject } from '../core/shared/dspace-object.model';
import { MetadataMap } from '../core/shared/metadata.models';
import { ListableObject } from '../shared/object-collection/shared/listable-object.model';

/**
 * Represents a search result object of a certain (<T>) DSpaceObject
 */
export class MyDSpaceResult<T extends DSpaceObject> implements ListableObject {
  /**
   * The DSpaceObject that was found
   */
  indexableObject: T;

  /**
   * The metadata that was used to find this item, hithighlighted
   */
  hitHighlights: MetadataMap;

}
