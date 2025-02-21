import {
  autoserialize,
  deserialize,
  inheritSerialization,
} from 'cerialize';
import { Observable } from 'rxjs';

import {
  link,
  typedObject,
} from '@dspace/core';
import { RemoteData } from '@dspace/core';
import { EPerson } from '@dspace/core';
import { EPERSON } from '@dspace/core';
import { DSpaceObject } from '@dspace/core';
import { DSPACE_OBJECT } from '@dspace/core';
import { HALLink } from '@dspace/core';
import { SUBSCRIPTION } from '../data/subscription.resource-type';

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
