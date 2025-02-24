import {
  CacheableObject,
  excludeFromEquals,
  HALLink,
  ResourceType,
  typedObject,
} from '@dspace/core';
import {
  autoserialize,
  deserialize,
} from 'cerialize';

import { STATISTICS_ENDPOINT } from './statistics-endpoint.resource-type';

/**
 * Model class for the statistics endpoint
 */
@typedObject
export class StatisticsEndpoint implements CacheableObject {
  static type = STATISTICS_ENDPOINT;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The {@link HALLink}s for the statistics endpoint
   */
  @deserialize
  _links: {
    self: HALLink;
    searchevents: HALLink;
    viewevents: HALLink;
  };
}
