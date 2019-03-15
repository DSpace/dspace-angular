import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { ResourcePolicy } from '../../shared/resource-policy.model';

import { mapsTo, relationship } from '../builders/build-decorators';
import { NormalizedObject } from './normalized-object.model';
import { IDToUUIDSerializer } from '../id-to-uuid-serializer';
import { ResourceType } from '../../shared/resource-type';
import { ActionType } from './action-type.model';

/**
 * Normalized model class for a Resource Policy
 */
@mapsTo(ResourcePolicy)
@inheritSerialization(NormalizedObject)
export class NormalizedResourcePolicy extends NormalizedObject<ResourcePolicy> {

  /**
   * The action that is allowed by this Resource Policy
   */
  action: ActionType;

  /**
   * The name for this Resource Policy
   */
  @autoserialize
  name: string;

  /**
   * The uuid of the Group this Resource Policy applies to
   */
  @relationship(ResourceType.Group, false)
  @autoserializeAs(String, 'groupUUID')
  group: string;

  /**
   * Identifier for this Resource Policy
   * Note that this ID is unique for resource policies,
   * but might not be unique across different object types
   */
  @autoserialize
  id: string;

  /**
   * The universally unique identifier for this Resource Policy
   * Consist of a prefix and the id field to ensure the identifier is unique across all object types
   */
  @autoserializeAs(new IDToUUIDSerializer('resource-policy'), 'id')
  uuid: string;
}
