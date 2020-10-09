import { autoserialize, deserialize } from 'cerialize';

import { CacheableObject } from '../../cache/object-cache.reducer';
import { OPENAIRE_BROKER_TOPIC_OBJECT } from './openaire-broker-topic-object.resource-type';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { ResourceType } from '../../shared/resource-type';
import { HALLink } from '../../shared/hal-link.model';
import { typedObject } from '../../cache/builders/build-decorators';

/**
 * The interface representing the OpenAIRE Broker topic model
 */
@typedObject
export class OpenaireBrokerTopicObject implements CacheableObject {
  /**
   * A string representing the kind of object, e.g. community, item, …
   */
  static type = OPENAIRE_BROKER_TOPIC_OBJECT;

  /**
   * The type of this ConfigObject
   */
  @excludeFromEquals
  type: ResourceType = OPENAIRE_BROKER_TOPIC_OBJECT;

  /**
   * The OpenAIRE Broker topic id
   */
  @autoserialize
  id: string;

  /**
   * The OpenAIRE Broker topic name to display
   */
  @autoserialize
  name: string;

  /**
   * The date of the last udate from OpenAIRE
   */
  @autoserialize
  lastEvent: string;

  /**
   * The total number of suggestions provided by OpenAIRE for this topic
   */
  @autoserialize
  totalSuggestions: number;

  /**
   * The links to all related resources returned by the rest api.
   */
  @deserialize
  _links: {
    self: HALLink,
  };
}
