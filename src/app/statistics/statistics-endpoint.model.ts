import {
  autoserialize,
  deserialize,
} from 'cerialize';

import { typedObject } from '../../../modules/core/src/lib/core/cache/builders/build-decorators';
import { CacheableObject } from '../../../modules/core/src/lib/core/cache/cacheable-object.model';
import { HALLink } from '../../../modules/core/src/lib/core/shared/hal-link.model';
import { ResourceType } from '../../../modules/core/src/lib/core/shared/resource-type';
import { excludeFromEquals } from '../../../modules/core/src/lib/core/utilities/equals.decorators';
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
