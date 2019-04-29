import { PageInfo } from '../shared/page-info.model';
import { autoserialize, autoserializeAs } from 'cerialize';
import { MetadataField } from '../metadata/metadata-field.model';

/**
 * Class that represents a response with a registry's metadata fields
 */
export class RegistryMetadatafieldsResponse {
  /**
   * List of metadata fields in the response
   */
  @autoserializeAs(MetadataField)
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
