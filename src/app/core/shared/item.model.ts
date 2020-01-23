import { Observable } from 'rxjs/internal/Observable';
import { isEmpty } from '../../shared/empty.util';
import { DEFAULT_ENTITY_TYPE } from '../../shared/metadata-representation/metadata-representation.decorator';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { link } from '../cache/builders/build-decorators';
import { PaginatedList } from '../data/paginated-list';
import { RemoteData } from '../data/remote-data';
import { Bundle } from './bundle.model';
import { Collection } from './collection.model';

import { DSpaceObject } from './dspace-object.model';
import { GenericConstructor } from './generic-constructor';
import { HALLink } from './hal-link.model';
import { Relationship } from './item-relationships/relationship.model';
import { ITEM } from "./item.resource-type";
import { RELATIONSHIP } from "./relationship.resource-type";

/**
 * Class representing a DSpace Item
 */
export class Item extends DSpaceObject {
  static type = ITEM;

  /**
   * A string representing the unique handle of this Item
   */
  handle: string;

  /**
   * The Date of the last modification of this Item
   */
  lastModified: Date;

  /**
   * A boolean representing if this Item is currently archived or not
   */
  isArchived: boolean;

  /**
   * A boolean representing if this Item is currently discoverable or not
   */
  isDiscoverable: boolean;

  /**
   * A boolean representing if this Item is currently withdrawn or not
   */
  isWithdrawn: boolean;

  /**
   * The Collection that owns this Item
   */
  @link(Collection.type)
  owningCollection?: Observable<RemoteData<Collection>>;

  @link(Bundle.type, true)
  bundles?: Observable<RemoteData<PaginatedList<Bundle>>>;

  @link(RELATIONSHIP)
  relationships?: Observable<RemoteData<PaginatedList<Relationship>>>;

  _links: {
    mappedCollections: HALLink;
    relationships: HALLink;
    bundles: HALLink;
    owningCollection: HALLink;
    templateItemOf: HALLink;
    self: HALLink;
  };

  /**
   * Method that returns as which type of object this object should be rendered
   */
  getRenderTypes(): Array<string | GenericConstructor<ListableObject>> {
    let entityType = this.firstMetadataValue('relationship.type');
    if (isEmpty(entityType)) {
      entityType = DEFAULT_ENTITY_TYPE;
    }
    return [entityType, ...super.getRenderTypes()];
  }
}
