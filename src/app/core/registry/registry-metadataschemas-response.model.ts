import { MetadataSchema } from '../metadata/metadataschema.model';
import { PageInfo } from '../shared/page-info.model';
import { autoserialize, autoserializeAs } from 'cerialize';

export class RegistryMetadataschemasResponse {
  @autoserializeAs(MetadataSchema)
  metadataschemas: MetadataSchema[];

  @autoserialize
  page: PageInfo;

  @autoserialize
  self: string;
}
