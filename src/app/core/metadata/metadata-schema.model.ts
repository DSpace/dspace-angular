import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { GenericConstructor } from '../shared/generic-constructor';
import { HALLink } from '../shared/hal-link.model';
import { HALResource } from '../shared/hal-resource.model';
import { METADATA_SCHEMA } from './metadata-schema.resource-type';

/**
 * Class that represents a metadata schema
 */
export class MetadataSchema extends ListableObject implements HALResource {
  static type = METADATA_SCHEMA;

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

  _links: {
    self: HALLink,
  };

  /**
   * Method that returns as which type of object this object should be rendered
   */
  getRenderTypes(): Array<string | GenericConstructor<ListableObject>> {
    return [this.constructor as GenericConstructor<ListableObject>];
  }
}
