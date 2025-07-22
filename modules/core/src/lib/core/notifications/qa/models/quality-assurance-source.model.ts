import {
  autoserialize,
  deserialize,
} from 'cerialize';

import {
  CacheableObject,
  typedObject,
} from '../../../cache';
import {
  HALLink,
  Item,
  ResourceType,
} from '../../../shared';
import { excludeFromEquals } from '../../../utilities';
import { QualityAssuranceEventObject } from './quality-assurance-event.model';
import { QUALITY_ASSURANCE_SOURCE_OBJECT } from './quality-assurance-source-object.resource-type';

/**
 * The interface representing the Quality Assurance source model
 */
@typedObject
export class QualityAssuranceSourceObject implements CacheableObject {
  /**
   * A string representing the kind of object, e.g. community, item, …
   */
  static type = QUALITY_ASSURANCE_SOURCE_OBJECT;

  /**
   * The Quality Assurance source id
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

/**
 * The possible types of import for the external entry
 */
export enum ImportType {
  None = 'None',
  LocalEntity = 'LocalEntity',
  LocalAuthority = 'LocalAuthority',
  NewEntity = 'NewEntity',
  NewAuthority = 'NewAuthority'
}

/**
 * The data type passed from the parent page
 */
export interface QualityAssuranceEventData {
  /**
   * The Quality Assurance event
   */
  event: QualityAssuranceEventObject;
  /**
   * The Quality Assurance event Id (uuid)
   */
  id: string;
  /**
   * The publication title
   */
  title: string;
  /**
   * Contains the boolean that indicates if a project is present
   */
  hasProject: boolean;
  /**
   * The project title, if present
   */
  projectTitle: string;
  /**
   * The project id (uuid), if present
   */
  projectId: string;
  /**
   * The project handle, if present
   */
  handle: string;
  /**
   * The reject/discard reason
   */
  reason: string;
  /**
   * Contains the boolean that indicates if there is a running operation (REST call)
   */
  isRunning: boolean;
  /**
   * The related publication DSpace item
   */
  target?: Item;
}
