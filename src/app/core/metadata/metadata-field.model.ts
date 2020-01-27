import { isNotEmpty } from '../../shared/empty.util';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { link } from '../cache/builders/build-decorators';
import { GenericConstructor } from '../shared/generic-constructor';
import { HALLink } from '../shared/hal-link.model';
import { HALResource } from '../shared/hal-resource.model';
import { METADATA_FIELD } from './metadata-field.resource-type';
import { MetadataSchema } from './metadata-schema.model';
import { METADATA_SCHEMA } from './metadata-schema.resource-type';

/**
 * Class the represents a metadata field
 */
export class MetadataField extends ListableObject implements HALResource {
  static type = METADATA_FIELD;

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
  @link(METADATA_SCHEMA)
  // TODO the responseparsingservice assumes schemas are always embedded. This should be remotedata instead.
  schema?: MetadataSchema;

  _links: {
    self: HALLink,
    schema: HALLink
  };

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
