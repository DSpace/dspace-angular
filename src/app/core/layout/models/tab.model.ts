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
 * Model representing a layout tab in the dynamic item page system.
 *
 * A tab defines a named section of an item's detail page. Tabs contain rows and cells
 * forming a grid layout, and may be marked as "leading" (rendered above the main content).
 * Tabs are fetched from the REST API via the `/tabs` endpoint.
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


/**
 * A row within a tab's layout grid. Contains cells arranged horizontally.
 */
export interface DynamicLayoutRow {
  /** CSS classes applied to the row element (e.g., Bootstrap grid row classes). */
  style: string;
  /** Array of cells within this row. */
  cells: DynamicLayoutCell[];
}

/**
 * A cell within a layout row. Contains one or more boxes.
 */
export interface DynamicLayoutCell {
  /** CSS classes applied to the cell element (e.g., Bootstrap column classes). */
  style: string;
  /** Array of boxes rendered within this cell. */
  boxes: DynamicLayoutBox[];
}

