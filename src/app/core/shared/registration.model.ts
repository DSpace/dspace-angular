// eslint-disable-next-line max-classes-per-file
import { AuthRegistrationType } from '../auth/models/auth.registration-type';
import { typedObject } from '../cache/builders/build-decorators';
import { MetadataValue } from './metadata.models';
import { REGISTRATION } from './registration.resource-type';
import { ResourceType } from './resource-type';
import { UnCacheableObject } from './uncacheable-object.model';

export class RegistrationDataMetadataMap {
  [key: string]: RegistrationDataMetadataValue[];
}

export class RegistrationDataMetadataValue extends MetadataValue {
  overrides?: string;
}
@typedObject
export class Registration implements UnCacheableObject {
  static type = REGISTRATION;

  /**
 * The unique identifier of this registration data
 */
  id: string;

  /**
   * The object type
   */
  type: ResourceType;

  /**
   * The email linked to the registration
   */
  email: string;

  /**
   * The user linked to the registration
   */
  user: string;

  /**
   * The token linked to the registration
   */
  token: string;
  /**
   * The token linked to the registration
   */
  groupNames: string[];

  /**
   * The token linked to the registration
   */
  groups: string[];

  /**
   * The registration type (e.g. orcid, shibboleth, etc.)
   */
  registrationType?: AuthRegistrationType;

  /**
   * The netId of the user (e.g. for ORCID - <:orcid>)
   */
  netId?: string;

  /**
  * The metadata involved during the registration process
  */
  registrationMetadata?: RegistrationDataMetadataMap;
}
