import { autoserialize } from 'cerialize';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { mapsTo } from '../cache/builders/build-decorators';
import { CacheableObject } from '../cache/object-cache.reducer';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { MetadataSchema } from './metadataschema.model';

@mapsTo(MetadataSchema)
export class NormalizedMetadataSchema extends NormalizedObject<MetadataSchema> implements ListableObject {
  @autoserialize
  id: number;

  @autoserialize
  self: string;

  @autoserialize
  prefix: string;

  @autoserialize
  namespace: string;
}
