import {
  autoserialize,
  autoserializeAs,
  deserialize,
  inheritSerialization,
} from 'cerialize';

import { typedObject } from '../../cache/builders/build-decorators';
import { HALLink } from '../../shared/hal-link.model';
import { HALResource } from '../../shared/hal-resource.model';
import { ResourceType } from '../../shared/resource-type';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { STATISTICS_CATEGORY } from './statistics-category.resource-type';

/**
 * Statistics category.
 */
@typedObject
@inheritSerialization(HALResource)
export class StatisticsCategory extends HALResource {

  static type = STATISTICS_CATEGORY;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
    type: ResourceType;

  @autoserialize
    id: string;

  @autoserializeAs('category-type')
    categoryType: string;

  @deserialize
    _links: {
    self: HALLink;
  };
}

