import { autoserialize, inheritSerialization } from 'cerialize';
import { Observable } from 'rxjs';
import { link, typedObject } from '../../../core/cache/builders/build-decorators';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { HALLink } from '../../../core/shared/hal-link.model';
import { SUBSCRIPTION } from './subscription.resource-type';

@typedObject
@inheritSerialization(DSpaceObject)
export class Subscription extends DSpaceObject {
  static type = SUBSCRIPTION;

  /**
   * A string representing the unique handle of this Collection
   */
  @autoserialize
  public subscriptionType: string;

  /**
   * A string representing the netid of this EPerson
   */
  @autoserialize
  public subscriptionParameterList: SubscriptionParameterList[];

  _links: {
    self: HALLink;
    ePerson: HALLink;
    dSpaceObject: HALLink;
  };

}

export interface SubscriptionParameterList {
  id: string;
  name: string;
  value: string;
}
