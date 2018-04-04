import { PageInfo } from '../shared/page-info.model';
import { autoserialize, autoserializeAs } from 'cerialize';
import { MetadataField } from '../metadata/metadatafield.model';

export class RegistryMetadatafieldsResponse {
  @autoserializeAs(MetadataField)
  metadatafields: MetadataField[];

  @autoserialize
  page: PageInfo;

  @autoserialize
  self: string;
}
