import { autoserialize, deserialize, deserializeAs } from 'cerialize';
import { resourceType } from '../../cache/builders/build-decorators';
import { IDToUUIDSerializer } from '../../cache/id-to-uuid-serializer';
import { CacheableObject } from '../../cache/object-cache.reducer';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { HALLink } from '../hal-link.model';
import { ResourceType } from '../resource-type';
import { ITEM_TYPE } from './item-type.resource-type';

/**
 * Describes a type of Item
 */
@resourceType(ItemType.type)
export class ItemType implements CacheableObject {
  static type = ITEM_TYPE;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The identifier of this ItemType
   */
  @autoserialize
  id: string;

  @autoserialize
  label: string;

  /**
   * The universally unique identifier of this ItemType
   * This UUID is generated client-side and isn't used by the backend.
   * It is based on the ID, so it will be the same for each refresh.
   */
  @deserializeAs(new IDToUUIDSerializer(ItemType.type.value), 'id')
  uuid: string;

  @deserialize
  _links: {
    self: HALLink,
  };
}
