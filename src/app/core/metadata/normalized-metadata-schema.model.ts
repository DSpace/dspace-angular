import { autoserialize } from 'cerialize';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { mapsTo } from '../cache/builders/build-decorators';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { resourceType } from '../shared/resource-type.decorator';
import { ResourceType } from '../shared/resource-type';
import { MetadataSchema } from './metadata-schema.model';

/**
 * Normalized class for a DSpace MetadataSchema
 */
@mapsTo(MetadataSchema)
@resourceType(ResourceType.MetadataSchema)
export class NormalizedMetadataSchema extends NormalizedObject<MetadataSchema> implements ListableObject {
  /**
   * The unique identifier for this schema
   */
  @autoserialize
  id: number;

  /**
   * The REST link to itself
   */
  @autoserialize
  self: string;

  /**
   * A unique prefix that defines this schema
   */
  @autoserialize
  prefix: string;

  /**
   * The namespace for this schema
   */
  @autoserialize
  namespace: string;

  /**
   * The resource type of this metadata schema
   */
  @autoserialize
  type: ResourceType;
}
