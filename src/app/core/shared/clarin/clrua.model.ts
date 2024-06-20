import { link, typedObject } from '../../cache/builders/build-decorators';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { HALResource } from '../hal-resource.model';
import { HALLink } from '../hal-link.model';
import { GenericConstructor } from '../generic-constructor';
import { autoserialize, deserialize } from 'cerialize';
import { Observable } from 'rxjs';
import { RemoteData } from '../../data/remote-data';
import { PaginatedList } from '../../data/paginated-list.model';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { ResourceType } from '../resource-type';
import { CLARIN_LICENSE_RESOURCE_USER_ALLOWANCE } from './clrua.resource-type';
import { ClarinUserRegistration } from './clarin-user-registration.model';
import { CLARIN_USER_REGISTRATION } from './clarin-user-registration.resource-type';
import { CLARIN_USER_METADATA } from './clarin-user-metadata.resource-type';
import { ClarinUserMetadata } from './clarin-user-metadata.model';
import { CLARIN_LICENSE_RESOURCE_MAPPING } from './clarin-license-resource-mapping.resource-type';
import { ClarinLicenseResourceMapping } from './clarin-license-resource-mapping.model';

/**
 * CLRUA = ClarinLicenseResourceUserAllowance
 * Class which represents CLRUA object.
 */
@typedObject
export class ClruaModel extends ListableObject implements HALResource {

  static type = CLARIN_LICENSE_RESOURCE_USER_ALLOWANCE;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  @autoserialize
  token: string;

  /**
   * The {@link HALLink}s for this Clarin License
   */
  @deserialize
  _links: {
    userRegistration: HALLink,
    userMetadata: HALLink,
    resourceMapping: HALLink,
    self: HALLink
  };

  @link(CLARIN_USER_REGISTRATION)
  userRegistration?: Observable<RemoteData<ClarinUserRegistration>>;

  @link(CLARIN_USER_METADATA, true)
  userMetadata?: Observable<RemoteData<PaginatedList<ClarinUserMetadata>>>;

  @link(CLARIN_LICENSE_RESOURCE_MAPPING)
  resourceMapping?: Observable<RemoteData<ClarinLicenseResourceMapping>>;

  getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
    return [this.constructor as GenericConstructor<ListableObject>];
  }
}
