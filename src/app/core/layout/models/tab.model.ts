import { autoserialize, deserialize, deserializeAs } from 'cerialize';
import { typedObject, link } from '../../cache/builders/build-decorators';
import { TAB } from './tab.resource-type';
import { CacheableObject } from '../../cache/object-cache.reducer';
import { HALLink } from '../../shared/hal-link.model';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { ResourceType } from '../../shared/resource-type';
import { IDToUUIDSerializer } from '../../cache/id-to-uuid-serializer';
import { BOX } from './box.resource-type';
import { Observable } from 'rxjs';
import { RemoteData } from '../../data/remote-data';
import { Box } from './box.model';
import { PaginatedList } from '../../data/paginated-list';

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
      boxes: HALLink
  };

  /**
   * The type of Item found on the left side of this RelationshipType
   * Will be undefined unless the leftType {@link HALLink} has been resolved.
   */
  @link(BOX)
  boxes?: Observable<RemoteData<PaginatedList<Box>>>;
}
