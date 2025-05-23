/* eslint-disable max-classes-per-file */
import {
  autoserialize,
  autoserializeAs,
  deserialize,
} from 'cerialize';
import { Observable } from 'rxjs';

import {
  link,
  typedObject,
} from '../../../cache/builders/build-decorators';
import { CacheableObject } from '../../../cache/cacheable-object.model';
import { RemoteData } from '../../../data/remote-data';
import { HALLink } from '../../../shared/hal-link.model';
import { Item } from '../../../shared/item.model';
import { ITEM } from '../../../shared/item.resource-type';
import { ResourceType } from '../../../shared/resource-type';
import { excludeFromEquals } from '../../../utilities/equals.decorators';
import { QUALITY_ASSURANCE_EVENT_OBJECT } from './quality-assurance-event-object.resource-type';

/**
 * The interface representing the Quality Assurance event message
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface QualityAssuranceEventMessageObject {

}

/**
 * The interface representing the Quality Assurance event message
 */
export interface SourceQualityAssuranceEventMessageObject {
  /**
   * The type of 'value'
   */
  type: string;

  reason: string;

  /**
   * The value suggested by Notifications
   */
  value: string;

  /**
   * The abstract suggested by Notifications
   */
  abstract: string;

  /**
   * The project acronym suggested by Notifications
   */
  acronym: string;

  /**
   * The project code suggested by Notifications
   */
  code: string;

  /**
   * The project funder suggested by Notifications
   */
  funder: string;

  /**
   * The project program suggested by Notifications
   */
  fundingProgram?: string;

  /**
   * The project jurisdiction suggested by Notifications
   */
  jurisdiction: string;

  /**
   * The project title suggested by Notifications
   */
  title: string;

  /**
   * The Source ID.
   */
  sourceId: string;

  /**
   * The PID href.
   */
  pidHref: string;

  /**
   * Possible link to a page
   */
  href?: string;

  /**
   * The service Id
   */
  serviceId?: string;
}

/**
 * The interface representing the Quality Assurance event model
 */
@typedObject
export class QualityAssuranceEventObject implements CacheableObject {
  /**
   * A string representing the kind of object, e.g. community, item, …
   */
  static type = QUALITY_ASSURANCE_EVENT_OBJECT;

  /**
   * The Quality Assurance event uuid inside DSpace
   */
  @autoserialize
  id: string;

  /**
   * The universally unique identifier of this Quality Assurance event
   */
  @autoserializeAs(String, 'id')
  uuid: string;

  /**
   * The Quality Assurance event original id (ex.: the source archive OAI-PMH identifier)
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
   * The timestamp Quality Assurance event was saved in DSpace
   */
  @autoserialize
  eventDate: string;

  /**
   * The Quality Assurance event status (ACCEPTED, REJECTED, DISCARDED, PENDING)
   */
  @autoserialize
  status: string;

  /**
   * The suggestion data. Data may vary depending on the source
   */
  @autoserialize
  message: SourceQualityAssuranceEventMessageObject;

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
