import { Observable } from 'rxjs';
import { link } from '../../cache/builders/build-decorators';
import { CacheableObject } from '../../cache/object-cache.reducer';
import { RemoteData } from '../../data/remote-data';
import { EPerson } from '../../eperson/models/eperson.model';
import { EPERSON } from '../../eperson/models/eperson.resource-type';
import { HALLink } from '../../shared/hal-link.model';
import { AuthError } from './auth-error.model';
import { AUTH_STATUS } from './auth-status.resource-type';
import { AuthTokenInfo } from './auth-token-info.model';

/**
 * Object that represents the authenticated status of a user
 */
export class AuthStatus implements CacheableObject {
  static type = AUTH_STATUS;

  /**
   * The unique identifier of this auth status
   */
  id: string;

  /**
   * The unique uuid of this auth status
   */
  uuid: string;

  /**
   * True if REST API is up and running, should never return false
   */
  okay: boolean;

  /**
   * If the auth status represents an authenticated state
   */
  authenticated: boolean;

  /**
   * Authentication error if there was one for this status
   */
  error?: AuthError;

  /**
   * The eperson of this auth status
   */
  @link(EPERSON)
  eperson?: Observable<RemoteData<EPerson>>;

  /**
   * True if the token is valid, false if there was no token or the token wasn't valid
   */
  token?: AuthTokenInfo;

  /**
   * The self link of this auth status' REST object
   */
  self: string;

  _links: {
    self: HALLink;
    eperson: HALLink
  }
}
