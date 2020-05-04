import { PageInfo } from '../shared/page-info.model';
import { autoserialize, deserialize } from 'cerialize';
import { MetadataSchema } from '../metadata/metadata-schema.model';

export class RegistryMetadataschemasResponse {
  @deserialize
  metadataschemas: MetadataSchema[];

  @autoserialize
  page: PageInfo;

  @autoserialize
  self: string;
}
