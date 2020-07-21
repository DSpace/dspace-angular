import { CacheableObject } from '../../cache/object-cache.reducer';
import { BOX } from './box.resource-type';
import { typedObject, link } from '../../cache/builders/build-decorators';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { autoserialize, deserializeAs, deserialize } from 'cerialize';
import { ResourceType } from '../../shared/resource-type';
import { IDToUUIDSerializer } from '../../cache/id-to-uuid-serializer';
import { HALLink } from '../../shared/hal-link.model';
import { SEARCH_COMPONENT } from './search-component.resource-type';
import { Observable } from 'rxjs';
import { RemoteData } from '../../data/remote-data';
import { SearchComponent } from './search-component.model';

/**
 * Describes a type of Box
 */
@typedObject
export class Box extends CacheableObject {
  static type = BOX;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The identifier of this Box
   */
  @autoserialize
  id: number;

  /**
   * The universally unique identifier of this Tab
   * This UUID is generated client-side and isn't used by the backend.
   * It is based on the ID, so it will be the same for each refresh.
   */
  @deserializeAs(new IDToUUIDSerializer(Box.type.value), 'id')
  uuid: string;

  @autoserialize
  shortname: string;

  @autoserialize
  header: string;

  @autoserialize
  entityType: string;

  @autoserialize
  collapsed: boolean;

  @autoserialize
  minor: boolean;

  @autoserialize
  style: string;

  @autoserialize
  priority: number;

  @autoserialize
  clear: boolean;

  @autoserialize
  security: number;

  @autoserialize
  boxType: string;

  /**
   * The {@link HALLink}s for this Tab
   */
  @deserialize
  _links: {
      self: HALLink,
      configuration: HALLink
  };

  /**
   * The configuration for this Box
   * Will be undefined unless the configuration {@link HALLink} has been resolved.
   */
  @link(SEARCH_COMPONENT)
  configuration?: Observable<RemoteData<SearchComponent>>;

}
