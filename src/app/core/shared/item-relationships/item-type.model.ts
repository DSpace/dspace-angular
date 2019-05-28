import { CacheableObject } from '../../cache/object-cache.reducer';
import { ResourceType } from '../resource-type';

/**
 * Describes a type of Item
 */
export class ItemType implements CacheableObject {
  /**
   * The identifier of this ItemType
   */
  id: string;

  /**
   * The link to the rest endpoint where this object can be found
   */
  self: string;

  /**
   * The type of Resource this is
   */
  type: ResourceType;

  /**
   * The universally unique identifier of this ItemType
   */
  uuid: string;
}
