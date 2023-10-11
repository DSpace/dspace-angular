import { autoserialize, deserialize } from 'cerialize';
import { METRIC } from './metric.resource-type';
import { typedObject } from '../cache/builders/build-decorators';
import { CacheableObject } from '../cache/cacheable-object.model';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { ResourceType } from './resource-type';
import { HALLink } from './hal-link.model';

/**
 * Describes a type of Item
 */
@typedObject
export class Metric implements CacheableObject {
  static type = METRIC;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The identifier of this Metric
   */
  @autoserialize
  id: string;

  @autoserialize
  metricType: string;

  @autoserialize
  metricCount: number;

  @autoserialize
  acquisitionDate: Date;

  @autoserialize
  startDate: Date;

  @autoserialize
  endDate: Date;

  @autoserialize
  last: boolean;

  @autoserialize
  remark: string;

  @autoserialize
  deltaPeriod1: number;

  @autoserialize
  deltaPeriod2: number;

  @autoserialize
  rank: number;

  @autoserialize
  icon?: string;

  /**
   * The {@link HALLink}s for this Metric
   */
  @deserialize
  _links: {
    self: HALLink;
  };
}
