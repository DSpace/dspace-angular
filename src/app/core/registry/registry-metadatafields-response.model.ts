import { autoserialize, deserialize } from 'cerialize';
import { relationship } from '../cache/builders/build-decorators';
import { MetadataField } from '../metadata/metadata-field.model';
import { METADATA_FIELD } from '../metadata/metadata-field.resource-type';
import { HALLink } from '../shared/hal-link.model';
import { PageInfo } from '../shared/page-info.model';

/**
 * Class that represents a response with a registry's metadata fields
 */
export class RegistryMetadatafieldsResponse {
  static type = METADATA_FIELD;
  /**
   * List of metadata fields in the response
   */
  @deserialize
  @relationship(MetadataField, true)
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

  _links: {
    self: HALLink,
    schema: HALLink
  }
}
