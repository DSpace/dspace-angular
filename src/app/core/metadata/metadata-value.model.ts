import { link, typedObject } from '../cache/builders/build-decorators';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { HALResource } from '../shared/hal-resource.model';
import { METADATA_FIELD } from './metadata-field.resource-type';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { autoserialize, deserialize } from 'cerialize';
import { ResourceType } from '../shared/resource-type';
import { HALLink } from '../shared/hal-link.model';
import { Observable } from 'rxjs';
import { RemoteData } from '../data/remote-data';
import { GenericConstructor } from '../shared/generic-constructor';
import { METADATA_VALUE } from './metadata-value.resource-type';
import { MetadataField } from './metadata-field.model';

/**
 * Class that represents a metadata value
 */
@typedObject
export class MetadataValue extends ListableObject implements HALResource {
  static type = METADATA_VALUE;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The identifier of this metadata value
   */
  @autoserialize
  id: number;

  /**
   * The value of this metadata value object
   */
  @autoserialize
  value: string;

  /**
   * The language of this metadata value
   */
  @autoserialize
  language: string;

  /**
   * The authority of this metadata value
   */
  @autoserialize
  authority: string;

  /**
   * The confidence of this metadata value
   */
  @autoserialize
  confidence: string;

  /**
   * The place of this metadata value
   */
  @autoserialize
  place: string;

  /**
   * The {@link HALLink}s for this MetadataValue
   */
  @deserialize
  _links: {
    self: HALLink,
    field: HALLink
  };

  /**
   * The MetadataField for this MetadataValue
   * Will be undefined unless the schema {@link HALLink} has been resolved.
   */
  @link(METADATA_FIELD)
  field?: Observable<RemoteData<MetadataField>>;

  /**
   * Method to print this metadata value as a string
   */
  toString(): string {
    return `Value: ${this.value}`;
  }

  /**
   * Method that returns as which type of object this object should be rendered
   */
  getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
    return [this.constructor as GenericConstructor<ListableObject>];
  }
}
