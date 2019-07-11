import { PageInfo } from '../shared/page-info.model';
import { autoserialize, deserialize } from 'cerialize';
import { MetadataSchema } from '../metadata/metadata-schema.model';
import { relationship } from '../cache/builders/build-decorators';

export class RegistryMetadataschemasResponse {
  @deserialize
  @relationship(MetadataSchema, true)
  metadataschemas: MetadataSchema[];

  @autoserialize
  page: PageInfo;

  @autoserialize
  self: string;
}
