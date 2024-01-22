import { autoserialize, deserialize } from 'cerialize';

import { QUALITY_ASSURANCE_TOPIC_OBJECT } from './quality-assurance-topic-object.resource-type';
import { excludeFromEquals } from '../../../utilities/equals.decorators';
import { ResourceType } from '../../../shared/resource-type';
import { HALLink } from '../../../shared/hal-link.model';
import { typedObject } from '../../../cache/builders/build-decorators';
import {CacheableObject} from '../../../cache/cacheable-object.model';

/**
 * The interface representing the Quality Assurance topic model
 */
@typedObject
export class QualityAssuranceTopicObject implements CacheableObject {
  /**
   * A string representing the kind of object, e.g. community, item, …
   */
  static type = QUALITY_ASSURANCE_TOPIC_OBJECT;

  /**
   * The Quality Assurance topic id
   */
  @autoserialize
  id: string;

  /**
   * The Quality Assurance topic name to display
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
