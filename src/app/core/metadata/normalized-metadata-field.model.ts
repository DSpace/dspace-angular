import { autoserialize, deserialize } from 'cerialize';
import { mapsTo, relationship } from '../cache/builders/build-decorators';
import { ResourceType } from '../shared/resource-type';
import { resourceType } from '../shared/resource-type.decorator';
import { MetadataField } from './metadata-field.model';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';

/**
 * Class the represents a normalized metadata field
 */
@mapsTo(MetadataField)
@resourceType(ResourceType.MetadataField)
export class NormalizedMetadataField extends NormalizedObject<MetadataField> implements ListableObject {

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
  @relationship(ResourceType.MetadataSchema)
  schema: string;

  /**
   * The resource type of this normalized metadata field
   */
  @autoserialize
  type: ResourceType;
}
