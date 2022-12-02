import { typedObject } from '../../cache/builders/build-decorators';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { HALResource } from '../hal-resource.model';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { autoserialize, deserialize } from 'cerialize';
import { ResourceType } from '../resource-type';
import { HALLink } from '../hal-link.model';
import { CLARIN_USER_METADATA } from './clarin-user-metadata.resource-type';
import { GenericConstructor } from '../generic-constructor';

/**
 * Class which represents the ClarinUserMetadata object.
 */
@typedObject
export class ClarinUserMetadata extends ListableObject implements HALResource {
  static type = CLARIN_USER_METADATA;
  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  @autoserialize
  metadataKey: string;

  @autoserialize
  metadataValue: string;

  /**
   * The {@link HALLink}s for this Clarin License
   */
  @deserialize
  _links: {
    self: HALLink
  };

  getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
    return [this.constructor as GenericConstructor<ListableObject>];
  }

}
