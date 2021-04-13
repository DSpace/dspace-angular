import { autoserialize, inheritSerialization } from 'cerialize';
import { typedObject } from '../../cache/builders/build-decorators';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { ResourceType } from '../../shared/resource-type';
import { HALResource } from '../../shared/hal-resource.model';
import { STATISTICS_CATEGORY } from './statistics-category.resource-type';
import { HALLink } from '../../shared/hal-link.model';
import { deserialize, autoserializeAs } from 'cerialize';

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

