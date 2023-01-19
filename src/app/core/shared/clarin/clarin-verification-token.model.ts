import { typedObject } from '../../cache/builders/build-decorators';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { HALResource } from '../hal-resource.model';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { autoserialize, deserialize } from 'cerialize';
import { ResourceType } from '../resource-type';
import { HALLink } from '../hal-link.model';
import { GenericConstructor } from '../generic-constructor';
import { CLARIN_VERIFICATION_TOKEN } from './clarin-verification-token.resource-type';

/**
 * Class that represents a ClarinVerificationToken. A ClarinVerificationTokenRest is mapped to this object.
 */
@typedObject
export class ClarinVerificationToken extends ListableObject implements HALResource {
  static type = CLARIN_VERIFICATION_TOKEN;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The identifier of this ClarinVerificationToken
   */
  @autoserialize
  id: string;

  /**
   * The netid of the user which is trying to login.
   */
  @autoserialize
  ePersonNetID: string;

  /**
   * The email of the user which is trying to login.
   * The user must fill in the email in the auth-failed.component
   */
  @autoserialize
  email: string;

  /**
   * The Shibboleth headers which are passed from the IdP.
   */
  @autoserialize
  shibHeaders: string;

  /**
   * Generated verification token for registration and login.
   */
  @autoserialize
  token: string;

  /**
   * The {@link HALLink}s for this ClarinVerificationToken
   */
  @deserialize
  _links: {
    self: HALLink
  };

  /**
   * Method that returns as which type of object this object should be rendered
   */
  getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
    return [this.constructor as GenericConstructor<ListableObject>];
  }
}
