import { autoserialize, deserialize, deserializeAs } from 'cerialize';
import { typedObject } from '../../cache/builders/build-decorators';
import { TAB } from './tab.resource-type';
import { CacheableObject } from '../../cache/object-cache.reducer';
import { HALLink } from '../../shared/hal-link.model';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { ResourceType } from '../../shared/resource-type';
import { IDToUUIDSerializer } from '../../cache/id-to-uuid-serializer';
import { Box } from './box.model';

/**
 * Describes a type of Tab
 */
@typedObject
export class Tab extends CacheableObject {
  static type = TAB;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The identifier of this Tab
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
  rows?: Row[];
  /**
   * The universally unique identifier of this Tab
   * This UUID is generated client-side and isn't used by the backend.
   * It is based on the ID, so it will be the same for each refresh.
   */
  @deserializeAs(new IDToUUIDSerializer(Tab.type.value), 'id')
  uuid: string;

  /**
   * The {@link HALLink}s for this Tab
   */
  @deserialize
  _links: {
    self: HALLink,
  };

  /**
   * Contains nested tabs if exist
   */
  children?: Tab[];
}


export interface Row {
  style: string;
  cells: Cell[];
}



export interface Cell {
  style: string;
  boxes: Box[];
}
