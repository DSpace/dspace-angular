import {
  autoserialize,
  autoserializeAs,
  deserialize,
  inheritSerialization,
} from 'cerialize';

import { typedObject } from '../../cache';
import {
  HALLink,
  HALResource,
  ResourceType,
} from '../../shared';
import { excludeFromEquals } from '../../utilities';
import { USAGE_REPORT } from './usage-report.resource-type';

/**
 * A usage report.
 */
@typedObject
@inheritSerialization(HALResource)
export class UsageReport extends HALResource {

  static type = USAGE_REPORT;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  @autoserialize
  id: string;

  @autoserializeAs('report-type')
    reportType: string;

  @autoserialize
  points: Point[];

  @deserialize
  _links: {
    self: HALLink;
  };
}

/**
 * A statistics data point.
 */
export interface Point {
  id: string;
  label: string;
  type: string;
  values: {
    views: number;
  }[];
}
