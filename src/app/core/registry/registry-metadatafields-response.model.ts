import { autoserialize, deserialize } from 'cerialize';
import { typedObject } from '../cache/builders/build-decorators';
import { MetadataField } from '../metadata/metadata-field.model';
import { METADATA_FIELD } from '../metadata/metadata-field.resource-type';
import { HALLink } from '../shared/hal-link.model';
import { PageInfo } from '../shared/page-info.model';
import { ResourceType } from '../shared/resource-type';
import { excludeFromEquals } from '../utilities/equals.decorators';

/**
 * Class that represents a response with a registry's metadata fields
 */
@typedObject
export class RegistryMetadatafieldsResponse {
  static type = METADATA_FIELD;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * List of metadata fields in the response
   */
  @deserialize
  metadatafields: MetadataField[];

  /**
   * Page info of this response
   */
  @autoserialize
  page: PageInfo;

  /**
   * The REST link to this response
   */
  @autoserialize
  self: string;

  @deserialize
  _links: {
    self: HALLink,
  }
}
