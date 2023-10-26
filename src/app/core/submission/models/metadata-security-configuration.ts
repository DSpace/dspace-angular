import { ResourceType } from '../../shared/resource-type';
import { typedObject } from '../../cache/builders/build-decorators';
import { autoserialize, deserialize, deserializeAs } from 'cerialize';
import { IDToUUIDSerializer } from '../../cache/id-to-uuid-serializer';
import { HALLink } from '../../shared/hal-link.model';
import { CacheableObject } from '../../cache/cacheable-object.model';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { METADATA_SECURITY_TYPE } from './metadata-security-config.resource-type';

interface MetadataCustomSecurityEntries {
  [metadata: string]: number[];
}
/**
 * A model class for a security configuration of metadata.
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
   * List of security configurations for all of the metadatas of the entity type
   */
  @autoserialize
  metadataSecurityDefault: number[];
  /**
   * List of security configurations for all of the metadatas of the entity type
   */
  @autoserialize
  metadataCustomSecurity: MetadataCustomSecurityEntries;
  /**
   * The object type
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
