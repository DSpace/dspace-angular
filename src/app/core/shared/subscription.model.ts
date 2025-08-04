import {
  link,
  typedObject,
} from '@dspace/core/cache/builders/build-decorators';
import { RemoteData } from '@dspace/core/data/remote-data';
import { EPerson } from '@dspace/core/eperson/models/eperson.model';
import { EPERSON } from '@dspace/core/eperson/models/eperson.resource-type';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { DSPACE_OBJECT } from '@dspace/core/shared/dspace-object.resource-type';
import { HALLink } from '@dspace/core/shared/hal-link.model';
import {
  autoserialize,
  deserialize,
  inheritSerialization,
} from 'cerialize';
import { Observable } from 'rxjs';

import { SUBSCRIPTION } from './subscription.resource-type';

@typedObject
@inheritSerialization(DSpaceObject)
export class Subscription extends DSpaceObject {
  static type = SUBSCRIPTION;

  /**
   * A string representing subscription type
   */
  @autoserialize
  public id: string;

  /**
   * A string representing subscription type
   */
  @autoserialize
  public subscriptionType: string;

  /**
   * An array of parameters for the subscription
   */
  @autoserialize
  public subscriptionParameterList: SubscriptionParameterList[];

  /**
   * The {@link HALLink}s for this Subscription
   */
  @deserialize
  _links: {
    self: HALLink;
    eperson: HALLink;
    resource: HALLink;
  };

  /**
   * The logo for this Community
   * Will be undefined unless the logo {@link HALLink} has been resolved.
   */
  @link(EPERSON)
  eperson?: Observable<RemoteData<EPerson>>;

  /**
   * The logo for this Community
   * Will be undefined unless the logo {@link HALLink} has been resolved.
   */
  @link(DSPACE_OBJECT)
  resource?: Observable<RemoteData<DSpaceObject>>;
  /**
   * The embedded ePerson & dSpaceObject for this Subscription
   */
  /*  @deserialize
    _embedded: {
      ePerson: EPerson;
      dSpaceObject: DSpaceObject;
    };*/
}

export interface SubscriptionParameterList {
  id: string;
  name: string;
  value: string;
}
