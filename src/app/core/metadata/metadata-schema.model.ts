import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { ResourceType } from '../shared/resource-type';

/**
 * Class that represents a metadata schema
 */
export class MetadataSchema implements ListableObject {
  static type = new ResourceType('metadataschema');

  /**
   * The unique identifier for this metadata schema
   */
  id: number;

  /**
   * The REST link to itself
   */
  self: string;

  /**
   * A unique prefix that defines this schema
   */
  prefix: string;

  /**
   * The namespace of this metadata schema
   */
  namespace: string;
}
