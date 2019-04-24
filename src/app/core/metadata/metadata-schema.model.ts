import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';

export class MetadataSchema implements ListableObject {
  id: number;

  self: string;

  prefix: string;

  namespace: string;
}
