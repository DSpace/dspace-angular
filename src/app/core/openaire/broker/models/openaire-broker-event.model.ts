import { Observable } from 'rxjs';
import { autoserialize, autoserializeAs, deserialize } from 'cerialize';
import { CacheableObject } from '../../../cache/object-cache.reducer';
import { OPENAIRE_BROKER_EVENT_OBJECT } from './openaire-broker-event-object.resource-type';
import { excludeFromEquals } from '../../../utilities/equals.decorators';
import { ResourceType } from '../../../shared/resource-type';
import { HALLink } from '../../../shared/hal-link.model';
import { Item } from '../../../shared/item.model';
import { ITEM } from '../../../shared/item.resource-type';
import { link, typedObject } from '../../../cache/builders/build-decorators';
import { RemoteData } from '../../../data/remote-data';

/**
 * The interface representing the OpenAIRE Broker event message
 */
export interface OpenaireBrokerEventMessageObject {
  /**
   * The type of 'value'
   */
  type: string;

  /**
   * The value suggested by OpenAIRE
   */
  value: string;

  /**
   * The abstract suggested by OpenAIRE
   */
  abstract: string;

  /**
   * The project acronym suggested by OpenAIRE
   */
  acronym: string;

  /**
   * The project code suggested by OpenAIRE
   */
  code: string;

  /**
   * The project funder suggested by OpenAIRE
   */
  funder: string;

  /**
   * The project program suggested by OpenAIRE
   */
  fundingProgram?: string;

  /**
   * The project jurisdiction suggested by OpenAIRE
   */
  jurisdiction: string;

  /**
   * The project title suggested by OpenAIRE
   */
  title: string;

  /**
   * The OpenAIRE ID.
   */
  openaireId: string;

}

/**
 * The interface representing the OpenAIRE Broker event model
 */
@typedObject
export class OpenaireBrokerEventObject implements CacheableObject {
  /**
   * A string representing the kind of object, e.g. community, item, …
   */
  static type = OPENAIRE_BROKER_EVENT_OBJECT;

  /**
   * The OpenAIRE Broker event uuid inside DSpace
   */
  @autoserialize
  id: string;

  /**
   * The universally unique identifier of this OpenAIRE Broker event
   */
  @autoserializeAs(String, 'id')
  uuid: string;

  /**
   * The OpenAIRE Broker event original id (ex.: the source archive OAI-PMH identifier)
   */
  @autoserialize
  originalId: string;

  /**
   * The title of the article to which the suggestion refers
   */
  @autoserialize
  title: string;

  /**
   * Reliability of the suggestion (of the data inside 'message')
   */
  @autoserialize
  trust: number;

  /**
   * The timestamp OpenAIRE Broker event was saved in DSpace
   */
  @autoserialize
  eventDate: string;

  /**
   * The OpenAIRE Broker event status (ACCEPTED, REJECTED, DISCARDED, PENDING)
   */
  @autoserialize
  status: string;

  /**
   * The suggestion data. Data may vary depending on the topic
   */
  @autoserialize
  message: OpenaireBrokerEventMessageObject;

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
    target: HALLink,
    related: HALLink
  };

  /**
   * The related publication DSpace item
   * Will be undefined unless the {@item HALLink} has been resolved.
   */
  @link(ITEM)
  target?: Observable<RemoteData<Item>>;

  /**
   * The related project for this Event
   * Will be undefined unless the {@related HALLink} has been resolved.
   */
  @link(ITEM)
  related?: Observable<RemoteData<Item>>;
}
