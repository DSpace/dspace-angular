import { typedObject } from '../../cache/builders/build-decorators';
import { CacheableObject } from '../../cache/object-cache.reducer';
import { SEARCH_COMPONENT } from './search-component.resource-type';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { autoserialize, deserializeAs, deserialize } from 'cerialize';
import { ResourceType } from '../../shared/resource-type';
import { IDToUUIDSerializer } from '../../cache/id-to-uuid-serializer';
import { HALLink } from '../../shared/hal-link.model';

/**
 * Describes a type of SearchComponent
 */
@typedObject
export class SearchComponent extends CacheableObject {
  static type = SEARCH_COMPONENT;

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
  @deserializeAs(new IDToUUIDSerializer(SearchComponent.type.value), 'id')
  uuid: string;

  @deserializeAs('discovery-configuration')
  configuration: string;

  /**
   * The {@link HALLink}s for this configuration
   */
  @deserialize
  _links: {
      self: HALLink,
  };
}
