import { Observable } from 'rxjs';
import { PaginatedList } from '../../data/paginated-list';
import { RemoteData } from '../../data/remote-data';

import { DSpaceObject } from '../../shared/dspace-object.model';
import { HALLink } from '../../shared/hal-link.model';
import { EPERSON } from './eperson.resource-type';
import { Group } from './group.model';

export class EPerson extends DSpaceObject {
  static type = EPERSON;

  /**
   * A string representing the unique handle of this Collection
   */
  public handle: string;

  /**
   * List of Groups that this EPerson belong to
   */
  public groups: Observable<RemoteData<PaginatedList<Group>>>;

  /**
   * A string representing the netid of this EPerson
   */
  public netid: string;

  /**
   * A string representing the last active date for this EPerson
   */
  public lastActive: string;

  /**
   * A boolean representing if this EPerson can log in
   */
  public canLogIn: boolean;

  /**
   * The EPerson email address
   */
  public email: string;

  /**
   * A boolean representing if this EPerson require certificate
   */
  public requireCertificate: boolean;

  /**
   * A boolean representing if this EPerson registered itself
   */
  public selfRegistered: boolean;

  /**
   * Getter to retrieve the EPerson's full name as a string
   */
  get name(): string {
    return this.firstMetadataValue('eperson.firstname') + ' ' + this.firstMetadataValue('eperson.lastname');
  }

  _links: {
    self: HALLink,
    groups: HALLink,
  }
}
