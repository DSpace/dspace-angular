import { MetadataSchema } from './metadataschema.model';
import { autoserialize } from 'cerialize';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';

export class MetadataField implements ListableObject {
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
}
