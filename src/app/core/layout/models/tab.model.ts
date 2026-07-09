import {
  autoserialize,
  deserialize,
  deserializeAs,
} from 'cerialize';

import { typedObject } from '../../cache/builders/build-decorators';
import { CacheableObject } from '../../cache/cacheable-object.model';
import { IDToUUIDSerializer } from '../../cache/id-to-uuid-serializer';
import { HALLink } from '../../shared/hal-link.model';
import { ResourceType } from '../../shared/resource-type';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { DynamicLayoutBox } from './box.model';
import { TAB } from './tab.resource-type';

/**
 * Describes a type of DynamicLayoutTab
 */
@typedObject
export class DynamicLayoutTab extends CacheableObject {
  static type = TAB;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
    type: ResourceType;

  /**
   * The identifier of this DynamicLayoutTab
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
    rows?: DynamicLayoutRow[];
  /**
   * The universally unique identifier of this DynamicLayoutTab
   * This UUID is generated client-side and isn't used by the backend.
   * It is based on the ID, so it will be the same for each refresh.
   */
  @deserializeAs(new IDToUUIDSerializer(DynamicLayoutTab.type.value), 'id')
    uuid: string;

  /**
   * The {@link HALLink}s for this DynamicLayoutTab
   */
  @deserialize
    _links: {
    self: HALLink,
  };

  /**
   * Contains nested tabs if exist
   */
  children?: DynamicLayoutTab[];
}


export interface DynamicLayoutRow {
  style: string;
  cells: DynamicLayoutCell[];
}

export interface DynamicLayoutCell {
  style: string;
  boxes: DynamicLayoutBox[];
}

