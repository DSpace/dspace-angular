import { CacheableObject } from '../cache/object-cache.reducer';
import { ResourceType } from './resource-type';
import { ActionType } from '../cache/models/action-type.model';

/**
 * Model class for a Resource Policy
 */
export class ResourcePolicy implements CacheableObject {
  static type = new ResourceType('resourcePolicy');

  /**
   * The action that is allowed by this Resource Policy
   */
  action: ActionType;

  /**
   * The name for this Resource Policy
   */
  name: string;

  /**
   * The uuid of the Group this Resource Policy applies to
   */
  groupUUID: string;

  /**
   * The link to the rest endpoint where this Resource Policy can be found
   */
  self: string;

  /**
   * The universally unique identifier for this Resource Policy
   */
  uuid: string;

}
