import { autoserialize, deserialize } from 'cerialize';

import { CacheableObject } from '../../../cache/object-cache.reducer';
import { NOTIFICATIONS_BROKER_TOPIC_OBJECT } from './notifications-broker-topic-object.resource-type';
import { excludeFromEquals } from '../../../utilities/equals.decorators';
import { ResourceType } from '../../../shared/resource-type';
import { HALLink } from '../../../shared/hal-link.model';
import { typedObject } from '../../../cache/builders/build-decorators';

/**
 * The interface representing the Notifications Broker topic model
 */
@typedObject
export class NotificationsBrokerTopicObject implements CacheableObject {
  /**
   * A string representing the kind of object, e.g. community, item, …
   */
  static type = NOTIFICATIONS_BROKER_TOPIC_OBJECT;

  /**
   * The Notifications Broker topic id
   */
  @autoserialize
  id: string;

  /**
   * The Notifications Broker topic name to display
   */
  @autoserialize
  name: string;

  /**
   * The date of the last udate from Notifications
   */
  @autoserialize
  lastEvent: string;

  /**
   * The total number of suggestions provided by Notifications for this topic
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
