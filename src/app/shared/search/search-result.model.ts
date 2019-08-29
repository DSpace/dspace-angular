import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { MetadataMap } from '../../core/shared/metadata.models';
import { ListableObject } from '../object-collection/shared/listable-object.model';
import { excludeFromEquals, fieldsForEquals } from '../../core/utilities/equals.decorators';

/**
 * Represents a search result object of a certain (<T>) DSpaceObject
 */
export class SearchResult<T extends DSpaceObject> extends ListableObject {
  /**
   * The DSpaceObject that was found
   */
  @fieldsForEquals('uuid')
  indexableObject: T;

  /**
   * The metadata that was used to find this item, hithighlighted
   */
  @excludeFromEquals
  hitHighlights: MetadataMap;

  @excludeFromEquals
  _links: {};


}
