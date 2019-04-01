import { CacheableObject } from '../cache/object-cache.reducer';
import { ResourceType } from './resource-type';
import { Group } from '../eperson/models/group.model';
import { ActionType } from '../cache/models/action-type.model';

/**
 * Model class for a Resource Policy
 */
export class ResourcePolicy implements CacheableObject {
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
   * A ResourceType representing the kind of Object of this ResourcePolicy
   */
  type: ResourceType;

  /**
   * The universally unique identifier for this Resource Policy
   */
  uuid: string;

}
