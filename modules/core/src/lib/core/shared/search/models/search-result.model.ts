import {
  autoserialize,
  deserialize,
} from 'cerialize';

import { typedObject } from '../../../cache';
import { ListableObject } from '../../../object-collection';
import {
  excludeFromEquals,
  fieldsForEquals,
} from '../../../utilities';
import { DSpaceObject } from '../../dspace-object.model';
import { GenericConstructor } from '../../generic-constructor';
import { HALLink } from '../../hal-link.model';
import { HALResource } from '../../hal-resource.model';
import { MetadataMap } from '../../metadata.models';
import { SEARCH_RESULT } from '../types';

/**
 * Represents a search result object of a certain (<T>) DSpaceObject
 */
@typedObject
export class SearchResult<T extends DSpaceObject> extends ListableObject implements HALResource {
  static type = SEARCH_RESULT;

  /**
   * Doesn't get a type in the rest response, so it's hardcoded
   */
  type = SEARCH_RESULT;

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
  indexableObject: T;

  /**
   * Method that returns as which type of object this object should be rendered
   */
  getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
    return [this.constructor as GenericConstructor<ListableObject>];
  }
}
