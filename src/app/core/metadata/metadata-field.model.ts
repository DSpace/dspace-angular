import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { isNotEmpty } from '../../shared/empty.util';
import { MetadataSchema } from './metadata-schema.model';

export class MetadataField implements ListableObject {
  id: number;

  self: string;

  element: string;

  qualifier: string;

  scopeNote: string;

  schema: MetadataSchema;

  toString(separator: string = '.'): string {
    let key = this.schema.prefix + separator + this.element;
    if (isNotEmpty(this.qualifier)) {
      key += separator + this.qualifier;
    }
    return key;
  }
}
