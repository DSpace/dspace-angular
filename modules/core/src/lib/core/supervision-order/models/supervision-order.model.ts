import {
  autoserialize,
  deserialize,
  deserializeAs,
} from 'cerialize';
import { Observable } from 'rxjs';

import {
  link,
  typedObject,
} from '../../cache';
import { CacheableObject } from '../../cache';
import { IDToUUIDSerializer } from '../../cache';
import { RemoteData } from '../../data';
import { Group } from '../../eperson';
import { GROUP } from '../../eperson';
import { HALLink } from '../../shared';
import { Item } from '../../shared';
import { ITEM } from '../../shared';
import { ResourceType } from '../../shared';
import { excludeFromEquals } from '../../utilities';
import { SUPERVISION_ORDER } from './supervision-order.resource-type';

/**
 * Model class for a Supervision Order
 */
@typedObject
export class SupervisionOrder implements CacheableObject {
  static type = SUPERVISION_ORDER;

  /**
   * The identifier for this Supervision Order
   */
  @autoserialize
  id: string;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  ordertype: string;

  /**
   * The universally unique identifier for this Supervision Order
   * This UUID is generated client-side and isn't used by the backend.
   * It is based on the ID, so it will be the same for each refresh.
   */
  @deserializeAs(new IDToUUIDSerializer('supervision-order'), 'id')
    uuid: string;

  /**
   * The {@link HALLink}s for this SupervisionOrder
   */
  @deserialize
  _links: {
    item: HALLink,
    group: HALLink,
    self: HALLink,
  };

  /**
   * The related supervision Item
   * Will be undefined unless the item {@link HALLink} has been resolved.
   */
  @link(ITEM)
  item?: Observable<RemoteData<Item>>;

  /**
   * The group linked by this supervision order
   * Will be undefined unless the version {@link HALLink} has been resolved.
   */
  @link(GROUP)
  group?: Observable<RemoteData<Group>>;
}
