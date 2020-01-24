import { MetadataMap } from './metadata.models';
import { ResourceType } from './resource-type';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { GenericConstructor } from './generic-constructor';

/**
 * Model class for a single entry from an external source
 */
export class ExternalSourceEntry extends ListableObject {
  static type = new ResourceType('externalSourceEntry');

  /**
   * Unique identifier
   */
  id: string;

  /**
   * The value to display
   */
  display: string;

  /**
   * The value to store the entry with
   */
  value: string;

  /**
   * The ID of the external source this entry originates from
   */
  externalSource: string;

  /**
   * Metadata of the entry
   */
  metadata: MetadataMap;

  /**
   * The link to the rest endpoint where this External Source Entry can be found
   */
  self: string;

  /**
   * Method that returns as which type of object this object should be rendered
   */
  getRenderTypes(): Array<string | GenericConstructor<ListableObject>> {
    return [this.constructor as GenericConstructor<ListableObject>];
  }
}
