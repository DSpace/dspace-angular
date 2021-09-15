import { autoserialize, deserialize, inheritSerialization } from 'cerialize';
import { typedObject } from '../../../core/cache/builders/build-decorators';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { HALLink } from '../../../core/shared/hal-link.model';
import { SUBSCRIPTION } from './subscription.resource-type';
import { EPerson } from '../../../core/eperson/models/eperson.model';


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
    ePerson: HALLink;
    dSpaceObject: HALLink;
  };

  /**
   * The embedded ePerson & dSpaceObject for this Subscription
   */
  @deserialize
  _embedded: {
    ePerson: EPerson;
    dSpaceObject: DSpaceObject;
  };
}

export interface SubscriptionParameterList {
  id: string;
  name: string;
  value: string;
}
