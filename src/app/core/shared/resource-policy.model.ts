import { autoserialize, deserialize, deserializeAs } from 'cerialize';
import { typedObject } from '../cache/builders/build-decorators';
import { IDToUUIDSerializer } from '../cache/id-to-uuid-serializer';
import { ActionType } from '../cache/models/action-type.model';
import { CacheableObject } from '../cache/object-cache.reducer';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { HALLink } from './hal-link.model';
import { RESOURCE_POLICY } from './resource-policy.resource-type';
import { ResourceType } from './resource-type';

/**
 * Model class for a Resource Policy
 */
@typedObject
export class ResourcePolicy implements CacheableObject {
  static type = RESOURCE_POLICY;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The action that is allowed by this Resource Policy
   */
  @autoserialize
  action: ActionType;

  /**
   * The name for this Resource Policy
   */
  @autoserialize
  name: string;

  /**
   * The uuid of the Group this Resource Policy applies to
   */
  @autoserialize
  groupUUID: string;

  /**
   * The universally unique identifier for this Resource Policy
   * This UUID is generated client-side and isn't used by the backend.
   * It is based on the ID, so it will be the same for each refresh.
   */
  @deserializeAs(new IDToUUIDSerializer('resource-policy'), 'id')
  uuid: string;

  /**
   * The {@link HALLink}s for this ResourcePolicy
   */
  @deserialize
  _links: {
    self: HALLink,
  }
}
