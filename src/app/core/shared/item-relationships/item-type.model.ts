import { CacheableObject } from '../../cache/object-cache.reducer';
import { HALLink } from '../hal-link.model';
import { ITEM_TYPE } from './item-type.resource-type';

/**
 * Describes a type of Item
 */
export class ItemType implements CacheableObject {
  static type = ITEM_TYPE;

  /**
   * The identifier of this ItemType
   */
  id: string;

  label: string;

  /**
   * The link to the rest endpoint where this object can be found
   */
  self: string;

  /**
   * The universally unique identifier of this ItemType
   */
  uuid: string;

  _links: {
    self: HALLink,
  };
}
