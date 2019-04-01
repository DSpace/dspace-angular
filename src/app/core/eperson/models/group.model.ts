import { Observable } from 'rxjs';

import { DSpaceObject } from '../../shared/dspace-object.model';
import { PaginatedList } from '../../data/paginated-list';
import { RemoteData } from '../../data/remote-data';

export class Group extends DSpaceObject {

  /**
   * List of Groups that this Group belong to
   */
  public groups: Observable<RemoteData<PaginatedList<Group>>>;

  /**
   * A string representing the unique handle of this Group
   */
  public handle: string;

  /**
   * A string representing the name of this Group
   */
  public name: string;

  /**
   * A string representing the name of this Group is permanent
   */
  public permanent: boolean;
}
