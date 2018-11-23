import { CacheableObject } from '../../cache/object-cache.reducer';
import { ResourceType } from '../resource-type';

export class EntityType implements CacheableObject {
  /**
   * The identifier of this EntityType
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
   * The universally unique identifier of this EntityType
   */
  uuid: string;
}
