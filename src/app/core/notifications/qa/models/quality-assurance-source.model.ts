import {
  autoserialize,
  deserialize,
} from 'cerialize';

import { typedObject } from '../../../cache/builders/build-decorators';
import { CacheableObject } from '../../../cache/cacheable-object.model';
import { HALLink } from '../../../shared/hal-link.model';
import { ResourceType } from '../../../shared/resource-type';
import { excludeFromEquals } from '../../../utilities/equals.decorators';
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
