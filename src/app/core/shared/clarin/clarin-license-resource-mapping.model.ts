import { link, typedObject } from '../../cache/builders/build-decorators';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { HALResource } from '../hal-resource.model';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { autoserialize, deserialize } from 'cerialize';
import { ResourceType } from '../resource-type';
import { HALLink } from '../hal-link.model';
import { Observable } from 'rxjs';
import { RemoteData } from '../../data/remote-data';
import { ClarinLicense } from './clarin-license.model';
import { CLARIN_LICENSE } from './clarin-license.resource-type';
import { CLARIN_LICENSE_RESOURCE_MAPPING } from './clarin-license-resource-mapping.resource-type';
import { GenericConstructor } from '../generic-constructor';

/**
 * Class which wraps the Clarin License Resource Mapping object for communicating with BE.
 */
@typedObject
export class ClarinLicenseResourceMapping extends ListableObject implements HALResource {

  static type = CLARIN_LICENSE_RESOURCE_MAPPING;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  @autoserialize
  bitstreamID: string;

  /**
   * The {@link HALLink}s for this Clarin License
   */
  @deserialize
  _links: {
    clarinLicense: HALLink,
    self: HALLink
  };

  @link(CLARIN_LICENSE)
  clarinLicense?: Observable<RemoteData<ClarinLicense>>;

  getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
    return [this.constructor as GenericConstructor<ListableObject>];
  }
}
