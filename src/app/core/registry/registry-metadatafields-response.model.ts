import { PageInfo } from '../shared/page-info.model';
import { autoserialize, deserialize } from 'cerialize';
import { ResourceType } from '../shared/resource-type';
import { relationship } from '../cache/builders/build-decorators';
import { NormalizedMetadataField } from '../metadata/normalized-metadata-field.model';
import { MetadataField } from '../metadata/metadata-field.model';

/**
 * Class that represents a response with a registry's metadata fields
 */
export class RegistryMetadatafieldsResponse {
  static type = new ResourceType('metadatafield');
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
}
