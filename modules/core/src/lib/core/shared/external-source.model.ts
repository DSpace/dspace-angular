import {
  autoserialize,
  deserialize,
} from 'cerialize';
import { Observable } from 'rxjs';

import {
  link,
  typedObject,
} from '../cache';
import { CacheableObject } from '../cache';
import { PaginatedList } from '../data';
import { RemoteData } from '../data';
import { excludeFromEquals } from '../utilities';
import { EXTERNAL_SOURCE } from './external-source.resource-type';
import { HALLink } from './hal-link.model';
import { ItemType } from './item-relationships';
import { ITEM_TYPE } from './item-relationships';
import { ResourceType } from './resource-type';

/**
 * Model class for an external source
 */
@typedObject
export class ExternalSource extends CacheableObject {
  static type = EXTERNAL_SOURCE;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * Unique identifier
   */
  @autoserialize
  id: string;

  /**
   * The name of this external source
   */
  @autoserialize
  name: string;

  /**
   * Is the source hierarchical?
   */
  @autoserialize
  hierarchical: boolean;

  /**
   * The list of entity types that are compatible with this external source
   * Will be undefined unless the entityTypes {@link HALLink} has been resolved.
   */
  @link(ITEM_TYPE, true)
  entityTypes?: Observable<RemoteData<PaginatedList<ItemType>>>;

  /**
   * The {@link HALLink}s for this ExternalSource
   */
  @deserialize
  _links: {
    self: HALLink;
    entries: HALLink;
    entityTypes: HALLink;
  };
}
