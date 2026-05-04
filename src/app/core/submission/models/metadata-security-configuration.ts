/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import {
  autoserialize,
  deserialize,
  deserializeAs,
} from 'cerialize';

import { typedObject } from '../../cache/builders/build-decorators';
import { CacheableObject } from '../../cache/cacheable-object.model';
import { IDToUUIDSerializer } from '../../cache/id-to-uuid-serializer';
import { HALLink } from '../../shared/hal-link.model';
import { ResourceType } from '../../shared/resource-type';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { METADATA_SECURITY_TYPE } from './metadata-security-config.resource-type';

interface MetadataCustomSecurityEntries {
  [metadata: string]: number[];
}
/**
 * Model class representing the metadata security configuration associated with a given entity type.
 * This class is used to determine which security levels are applied
 * to metadata fields — either globally via a default, or on a per-field
 * basis via custom entries.
 *
 * Security levels are represented as integers:
 * - `0` → Public (visible to everyone)
 * - `1` → Registered users (visible to authenticated users only)
 * - `2` → Administrator (visible to administrators only)
 */
@typedObject
export class MetadataSecurityConfiguration extends CacheableObject {
  static type = METADATA_SECURITY_TYPE;
  /**
   * The universally unique identifier of this WorkspaceItem
   * This UUID is generated client-side and isn't used by the backend.
   * It is based on the ID, so it will be the same for each refresh.
   */
  @deserializeAs(new IDToUUIDSerializer(MetadataSecurityConfiguration.type.value), 'id')
    uuid: string;
  /**
   * Array of security levels applied by default to all metadata fields
   * of the entity type, when no custom rule is defined for a specific field.
   *
   * Each element is an integer representing a security level
   * (0 = public, 1 = registered users, 2 = administrators).
   *
   * @example [0, 1]
   */
  @autoserialize
    metadataSecurityDefault: number[];
  /**
   * Map of custom security configurations for individual metadata fields
   * of the entity type.
   *
   * Allows overriding the default behavior (`metadataSecurityDefault`)
   * for specific fields. The key is the qualified metadata field name
   * (e.g. `dc.title`), and the value is the array of security levels applied.
   *
   * @see MetadataCustomSecurityEntries
   *
   * @example
   * {
   *   "dc.title": [0,1],
   *   "dc.rights": [1,2]
   * }
   */
  @autoserialize
    metadataCustomSecurity: MetadataCustomSecurityEntries;
  /**
   * The REST resource type, automatically populated during
   * deserialization from the backend response.
   */
  @excludeFromEquals
  @autoserialize
    type: ResourceType;
  /**
   * The {@link HALLink}s for this MetadataSecurityConfiguration
   */
  @deserialize
    _links: {
    self: HALLink;
  };
}
