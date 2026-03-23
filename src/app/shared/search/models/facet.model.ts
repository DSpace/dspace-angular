import {
  autoserialize,
  autoserializeAs,
  deserialize,
} from 'cerialize';

import { typedObject } from '../../../core/cache/builders/build-decorators';
import { CacheableObject } from '../../../core/cache/cacheable-object.model';
import { HALLink } from '../../../core/shared/hal-link.model';
import { ResourceType } from '../../../core/shared/resource-type';
import { excludeFromEquals } from '../../../core/utilities/equals.decorators';
import { FilterType } from './filter-type.model';
import { FACET } from './types/facet.resource-type';

/**
 * The configuration for a discovery facet
 */
@typedObject
export class Facet implements CacheableObject {
  static type = FACET;

  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  @autoserialize
  name: string;

  @autoserialize
  id: string;

  @autoserializeAs(String)
  facetType: FilterType;

  @autoserialize
  facetLimit: number;

  /**
   * Minimum value possible for this facet in the repository
   */
  @autoserialize
  maxValue: string;

  /**
   * Maximum value possible for this facet in the repository
   */
  @autoserialize
  minValue: string;

  @autoserializeAs(Boolean, 'openByDefault')
  isOpenByDefault: boolean;

  @deserialize
  _links: {
    self: HALLink;
    values: HALLink;
  };
}
