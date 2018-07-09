import { autoserialize } from 'cerialize';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';

export class MetadataSchema implements ListableObject {
  @autoserialize
  id: number;

  @autoserialize
  self: string;

  @autoserialize
  prefix: string;

  @autoserialize
  namespace: string;
}
