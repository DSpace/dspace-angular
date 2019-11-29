import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { ResourceType } from '../shared/resource-type';
import { GenericConstructor } from '../shared/generic-constructor';

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

  /**
   * Method that returns as which type of object this object should be rendered
   */
  getRenderTypes(): Array<string | GenericConstructor<ListableObject>> {
    return [this.constructor as GenericConstructor<ListableObject>];
  }
}
