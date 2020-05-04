import { autoserialize, deserialize } from 'cerialize';
import { link } from '../../core/cache/builders/build-decorators';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { DSPACE_OBJECT } from '../../core/shared/dspace-object.resource-type';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { HALLink } from '../../core/shared/hal-link.model';
import { MetadataMap } from '../../core/shared/metadata.models';
import { excludeFromEquals, fieldsForEquals } from '../../core/utilities/equals.decorators';
import { ListableObject } from '../object-collection/shared/listable-object.model';

/**
 * Represents a search result object of a certain (<T>) DSpaceObject
 */
export class SearchResult<T extends DSpaceObject> extends ListableObject {
  /**
   * The metadata that was used to find this item, hithighlighted
   */
  @excludeFromEquals
  @autoserialize
  hitHighlights: MetadataMap;

  /**
   * The {@link HALLink}s for this SearchResult
   */
  @deserialize
  _links: {
    self: HALLink;
    indexableObject: HALLink;
  };

  /**
   * The DSpaceObject that was found
   */
  @fieldsForEquals('uuid')
  @link(DSPACE_OBJECT)
  indexableObject: T;

  /**
   * Method that returns as which type of object this object should be rendered
   */
  getRenderTypes(): Array<string | GenericConstructor<ListableObject>> {
    return [this.constructor as GenericConstructor<ListableObject>];
  }
}
