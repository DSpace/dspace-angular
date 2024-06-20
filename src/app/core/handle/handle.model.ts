import { typedObject } from '../cache/builders/build-decorators';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { HALResource } from '../shared/hal-resource.model';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { autoserialize , autoserializeAs, deserialize} from 'cerialize';
import { ResourceType } from '../shared/resource-type';
import { HALLink } from '../shared/hal-link.model';
import { GenericConstructor } from '../shared/generic-constructor';
import { HANDLE } from './handle.resource-type';
import { HandleResourceTypeIdSerializer } from './HandleResourceTypeIdserializer';

/**
 * Class represents the Handle of the Item/Collection/Community
 */
@typedObject
export class Handle extends ListableObject implements HALResource {
  static type = HANDLE;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The identifier of this metadata field
   */
  @autoserialize
  id: number;

  /**
   * The qualifier of this metadata field
   */
  @autoserialize
  handle: string;

  /**
   * The url of this metadata field
   */
  @autoserialize
  url: string;

  /**
   * The element of this metadata field
   */
  @autoserializeAs(HandleResourceTypeIdSerializer)
  resourceTypeID: string;

  /**
   * The {@link HALLink}s for this MetadataField
   */
  @deserialize
  _links: {
    self: HALLink,
  };

  /**
   * Method that returns as which type of object this object should be rendered
   */
  getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
    return [this.constructor as GenericConstructor<ListableObject>];
  }
}


