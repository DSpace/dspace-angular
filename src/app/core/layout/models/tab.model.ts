import { autoserialize, deserialize, deserializeAs } from 'cerialize';
import { typedObject } from '../../cache/builders/build-decorators';
import { TAB } from './tab.resource-type';
import { CacheableObject } from '../../cache/cacheable-object.model';
import { HALLink } from '../../shared/hal-link.model';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { ResourceType } from '../../shared/resource-type';
import { IDToUUIDSerializer } from '../../cache/id-to-uuid-serializer';
import { CrisLayoutBox } from './box.model';
import { Metric } from '../../shared/metric.model';

/**
 * Describes a type of CrisLayoutTab
 */
@typedObject
export class CrisLayoutTab extends CacheableObject {
  static type = TAB;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The identifier of this CrisLayoutTab
   */
  @autoserialize
  id: number;

  @autoserialize
  shortname: string;

  @autoserialize
  header: string;

  @autoserialize
  entityType: string;

  @autoserialize
  priority: number;

  @autoserialize
  security: number;

  /**
   * This property is used from navbar for highlight
   * the active tab
   */
  isActive?: boolean;

  /**
   * This property is used from leading component
   */
  @autoserialize
  leading?: boolean;

  @autoserialize
  rows?: CrisLayoutRow[];
  /**
   * The universally unique identifier of this CrisLayoutTab
   * This UUID is generated client-side and isn't used by the backend.
   * It is based on the ID, so it will be the same for each refresh.
   */
  @deserializeAs(new IDToUUIDSerializer(CrisLayoutTab.type.value), 'id')
  uuid: string;

  /**
   * The {@link HALLink}s for this CrisLayoutTab
   */
  @deserialize
  _links: {
    self: HALLink,
  };

  /**
   * Contains nested tabs if exist
   */
  children?: CrisLayoutTab[];
}


export interface CrisLayoutRow {
  style: string;
  cells: CrisLayoutCell[];
}

export interface CrisLayoutCell {
  style: string;
  boxes: CrisLayoutBox[];
}

export interface CrisLayoutMetricRow {
  metrics: Metric[];
}
