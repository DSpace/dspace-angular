import { autoserialize, autoserializeAs } from 'cerialize';

import { MetadataSchema } from '../metadata/metadataschema.model';
import { PageInfo } from '../shared/page-info.model';

export class RegistryMetadataschemasResponse {
  @autoserializeAs(MetadataSchema)
  metadataschemas: MetadataSchema[];

  @autoserialize
  page: PageInfo;

  @autoserialize
  self: string;
}
