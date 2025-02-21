import {
  autoserialize,
  deserialize,
} from 'cerialize';

import { typedObject } from '@dspace/core';
import { CacheableObject } from '@dspace/core';
import { HALLink } from '@dspace/core';
import { ResourceType } from '@dspace/core';
import { excludeFromEquals } from '@dspace/core';
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
