import {
  autoserialize,
  deserialize,
} from 'cerialize';

import { typedObject } from '../../../cache';
import { CacheableObject } from '../../../cache';
import { HALLink } from '../../../shared';
import { ResourceType } from '../../../shared';
import { excludeFromEquals } from '../../../utilities';
import { QUALITY_ASSURANCE_TOPIC_OBJECT } from './quality-assurance-topic-object.resource-type';

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
