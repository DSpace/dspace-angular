import { link, typedObject } from '../../cache/builders/build-decorators';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { HALResource } from '../hal-resource.model';
import { HALLink } from '../hal-link.model';
import { GenericConstructor } from '../generic-constructor';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { autoserialize, deserialize } from 'cerialize';
import { ResourceType } from '../resource-type';
import { Observable } from 'rxjs';
import { RemoteData } from '../../data/remote-data';
import { PaginatedList } from '../../data/paginated-list.model';
import { ClarinLicense } from './clarin-license.model';
import { CLARIN_LICENSE } from './clarin-license.resource-type';
import { CLARIN_USER_REGISTRATION } from './clarin-user-registration.resource-type';
import { CLARIN_USER_METADATA } from './clarin-user-metadata.resource-type';
import { ClarinUserMetadata } from './clarin-user-metadata.model';

/**
 * Class which represents ClarinUserRegistration object.
 */
@typedObject
export class ClarinUserRegistration extends ListableObject implements HALResource {

  static type = CLARIN_USER_REGISTRATION;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  @autoserialize
  id: number;

  @autoserialize
  ePersonID: string;

  @autoserialize
  email: string;

  @autoserialize
  organization: string;

  @autoserialize
  confirmation: boolean;

  /**
   * The {@link HALLink}s for this Clarin License
   */
  @deserialize
  _links: {
    clarinLicenses: HALLink,
    userMetadata: HALLink,
    self: HALLink
  };

  @link(CLARIN_LICENSE)
  clarinLicenses?: Observable<RemoteData<PaginatedList<ClarinLicense>>>;

  @link(CLARIN_USER_METADATA, true)
  userMetadata?: Observable<RemoteData<PaginatedList<ClarinUserMetadata>>>;

  getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
    return [this.constructor as GenericConstructor<ListableObject>];
  }

}
