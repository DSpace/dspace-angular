import { DSpaceObject } from '../core/shared/dspace-object.model';
import { MetadataMap } from '../core/shared/metadata.models';
import { ListableObject } from '../shared/object-collection/shared/listable-object.model';
import { GenericConstructor } from '../core/shared/generic-constructor';

/**
 * Represents a search result object of a certain (<T>) DSpaceObject
 */
export class SearchResult<T extends DSpaceObject> implements ListableObject {
  /**
   * The DSpaceObject that was found
   */
  indexableObject: T;

  /**
   * The metadata that was used to find this item, hithighlighted
   */
  hitHighlights: MetadataMap;

  /**
   * Method that returns as which type of object this object should be rendered
   */
  getRenderTypes(): Array<string | GenericConstructor<ListableObject>> {
    return [this.constructor as GenericConstructor<ListableObject>];
  }
}
