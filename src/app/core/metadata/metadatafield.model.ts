import { MetadataSchema } from './metadataschema.model';
import { autoserialize } from 'cerialize';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { isNotEmpty } from '../../shared/empty.util';

export class MetadataField implements ListableObject {
  @autoserialize
  id: number;

  @autoserialize
  self: string;

  @autoserialize
  element: string;

  @autoserialize
  qualifier: string;

  @autoserialize
  scopeNote: string;

  @autoserialize
  schema: MetadataSchema;

  toString(separator: string = '.'): string {
    let key = this.schema.prefix + separator + this.element;
    if (isNotEmpty(this.qualifier)) {
      key += separator + this.qualifier;
    }
    return key;
  }
}
