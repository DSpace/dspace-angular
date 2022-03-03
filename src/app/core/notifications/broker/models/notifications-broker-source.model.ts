import { autoserialize, deserialize } from 'cerialize';

import { CacheableObject } from '../../../cache/object-cache.reducer';
import { excludeFromEquals } from '../../../utilities/equals.decorators';
import { ResourceType } from '../../../shared/resource-type';
import { HALLink } from '../../../shared/hal-link.model';
import { typedObject } from '../../../cache/builders/build-decorators';
import { NOTIFICATIONS_BROKER_SOURCE_OBJECT } from './notifications-broker-source-object.resource-type';

/**
 * The interface representing the Notifications Broker source model
 */
@typedObject
export class NotificationsBrokerSourceObject implements CacheableObject {
  /**
   * A string representing the kind of object, e.g. community, item, …
   */
  static type = NOTIFICATIONS_BROKER_SOURCE_OBJECT;

  /**
   * The Notifications Broker source id
   */
  @autoserialize
  id: string;

  /**
   * The date of the last udate from Notifications
   */
  @autoserialize
  lastEvent: string;

  /**
   * The total number of suggestions provided by Notifications for this source
   */
  @autoserialize
  totalEvents: number;

  /**
   * The type of this ConfigObject
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The links to all related resources returned by the rest api.
   */
  @deserialize
  _links: {
    self: HALLink,
  };
}
