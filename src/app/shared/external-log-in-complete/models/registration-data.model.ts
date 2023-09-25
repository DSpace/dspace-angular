import { CacheableObject } from '../../../core/cache/cacheable-object.model';
import { typedObject } from '../../../core/cache/builders/build-decorators';
import { REGISTRATION_DATA } from './registration-data.resource-type';
import { autoserialize, deserialize } from 'cerialize';
import { excludeFromEquals } from '../../../core/utilities/equals.decorators';
import { ResourceType } from '../../../core/shared/resource-type';
import { AuthMethodType } from '../../../core/auth/models/auth.method-type';
import { MetadataMap } from '../../../core/shared/metadata.models';
import { HALLink } from '../../../core/shared/hal-link.model';

/**
 * Object that represents the authenticated status of a user
 */
@typedObject
export class RegistrationData implements CacheableObject {

  static type = REGISTRATION_DATA;

  /**
   * The unique identifier of this registration data
   */
  @autoserialize
  id: string;

  /**
   * The type for this RegistrationData
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The registered email address
   */
  @autoserialize
  email: string;

  /**
   * The registered user identifier
   */
  @autoserialize
  user: string;

  /**
   * The registration type (e.g. orcid, shibboleth, etc.)
   */
  @autoserialize
  registrationType?: AuthMethodType;

  /**
   * The netId of the user (e.g. for ORCID - <:orcid>)
   */
  @autoserialize
  netId?: string;


  /**
   * The metadata involved during the registration process
   */
  @autoserialize
  registrationMetadata?: MetadataMap;

  /**
   * The {@link HALLink}s for this RegistrationData
   */
    @deserialize
    _links: {
      self: HALLink;
    };
}
