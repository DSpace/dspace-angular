import { autoserialize, deserialize, inheritSerialization } from 'cerialize';
import { mapsTo, relationship } from '../cache/builders/build-decorators';
import { MetadataField } from './metadata-field.model';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { MetadataSchema } from './metadata-schema.model';

/**
 * Class the represents a normalized metadata field
 */
@mapsTo(MetadataField)
@inheritSerialization(NormalizedObject)
export class NormalizedMetadataField extends NormalizedObject<MetadataField> {

  /**
   * The identifier of this normalized metadata field
   */
  @autoserialize
  id: number;

  /**
   * The self link of this normalized metadata field
   */
  @autoserialize
  self: string;

  /**
   * The element of this normalized metadata field
   */
  @autoserialize
  element: string;

  /**
   * The qualifier of this normalized metadata field
   */
  @autoserialize
  qualifier: string;

  /**
   * The scope note of this normalized metadata field
   */
  @autoserialize
  scopeNote: string;

  /**
   * The link to the metadata schema of this normalized metadata field
   */
  @deserialize
  @relationship(MetadataSchema)
  schema: string;
}
