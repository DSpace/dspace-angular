import { Observable } from 'rxjs';

import { DSpaceObject } from '../../shared/dspace-object.model';
import { Group } from './group.model';
import { RemoteData } from '../../data/remote-data';
import { PaginatedList } from '../../data/paginated-list';
import { ResourceType } from '../../shared/resource-type';

export class EPerson extends DSpaceObject {
  static type = new ResourceType('eperson');

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
}
