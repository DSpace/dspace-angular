import { PageInfo } from '../shared/page-info.model';
import { autoserialize, deserialize } from 'cerialize';
import { MetadataField } from '../metadata/metadata-field.model';
import { relationship } from '../cache/builders/build-decorators';
import { ResourceType } from '../shared/resource-type';

/**
 * Class that represents a response with a registry's metadata fields
 */
export class RegistryMetadatafieldsResponse {
  /**
   * List of metadata fields in the response
   */
  @deserialize
  @relationship(ResourceType.MetadataField, true)
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
