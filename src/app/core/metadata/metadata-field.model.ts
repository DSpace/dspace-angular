import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { isNotEmpty } from '../../shared/empty.util';
import { MetadataSchema } from './metadata-schema.model';
import { ResourceType } from '../shared/resource-type';
import { GenericConstructor } from '../shared/generic-constructor';

/**
 * Class the represents a metadata field
 */
export class MetadataField implements ListableObject {
  static type = new ResourceType('metadatafield');

  /**
   * The identifier of this metadata field
   */
  id: number;

  /**
   * The self link of this metadata field
   */
  self: string;

  /**
   * The element of this metadata field
   */
  element: string;

  /**
   * The qualifier of this metadata field
   */
  qualifier: string;

  /**
   * The scope note of this metadata field
   */
  scopeNote: string;

  /**
   * The metadata schema object of this metadata field
   */
  schema: MetadataSchema;

  /**
   * Method to print this metadata field as a string
   * @param separator The separator between the schema, element and qualifier in the string
   */
  toString(separator: string = '.'): string {
    let key = this.schema.prefix + separator + this.element;
    if (isNotEmpty(this.qualifier)) {
      key += separator + this.qualifier;
    }
    return key;
  }

  /**
   * Method that returns as which type of object this object should be rendered
   */
  getRenderTypes(): Array<string | GenericConstructor<ListableObject>> {
    return [this.constructor as GenericConstructor<ListableObject>];
  }
}
