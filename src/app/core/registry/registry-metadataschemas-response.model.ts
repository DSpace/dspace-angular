import { PageInfo } from '../shared/page-info.model';
import { autoserialize, autoserializeAs } from 'cerialize';
import { MetadataSchema } from '../metadata/metadata-schema.model';

export class RegistryMetadataschemasResponse {
  @autoserializeAs(MetadataSchema)
  metadataschemas: MetadataSchema[];

  @autoserialize
  page: PageInfo;

  @autoserialize
  self: string;
}
