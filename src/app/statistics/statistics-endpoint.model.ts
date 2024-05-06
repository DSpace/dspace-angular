import {
  autoserialize,
  deserialize,
} from 'cerialize';

import { typedObject } from '../core/cache/builders/build-decorators';
import { CacheableObject } from '../core/cache/cacheable-object.model';
import { HALLink } from '../core/shared/hal-link.model';
import { ResourceType } from '../core/shared/resource-type';
import { excludeFromEquals } from '../core/utilities/equals.decorators';
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
