import { MetadataSchema } from './metadataschema.model';

export class MetadataField {
  self: string;
  element: string;
  qualifier: string;
  scopenote: string;
  schema: MetadataSchema;
}
