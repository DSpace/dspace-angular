import { autoserialize } from 'cerialize';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { CacheableObject } from '../cache/object-cache.reducer';

export class MetadataSchema extends ListableObject {
  id: number;

  self: string;

  prefix: string;

  namespace: string;
}
