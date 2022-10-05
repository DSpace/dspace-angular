import { CacheableObject } from '../../cache/cacheable-object.model';
import { typedObject } from '../../cache/builders/build-decorators';
import { autoserialize, deserialize } from 'cerialize';
import { HALLink } from '../../shared/hal-link.model';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { ResourceType } from '../../shared/resource-type';
import { METRICSCOMPONENT } from './metrics-component.resource-type';

/**
 * Describes a type of metricscomponent
 */
@typedObject
export class MetricsComponent extends CacheableObject {
  static type = METRICSCOMPONENT;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The identifier of the related CrisLayoutBox (shortname)
   */
  @autoserialize
  id: string;

  @autoserialize
  metrics: string[];

  /**
   * The {@link HALLink}s for this metricscomponent
   */
  @deserialize
  _links: {
    self: HALLink
  };
}
