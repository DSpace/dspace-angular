import { AuthError } from './auth-error.model';
import { AuthTokenInfo } from './auth-token-info.model';
import { EPerson } from '../../eperson/models/eperson.model';
import { RemoteData } from '../../data/remote-data';
import { Observable } from 'rxjs';
import { CacheableObject } from '../../cache/object-cache.reducer';
import { ResourceType } from '../../shared/resource-type';
import { AuthMethod } from './auth.method';

/**
 * Object that represents the authenticated status of a user
 */
export class AuthStatus implements CacheableObject {
  static type = new ResourceType('status');

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
  eperson: Observable<RemoteData<EPerson>>;

  /**
   * True if the token is valid, false if there was no token or the token wasn't valid
   */
  token?: AuthTokenInfo;

  /**
   * The self link of this auth status' REST object
   */
  self: string;

  /**
   * All authentication methods enabled at the backend
   */
  authMethods: AuthMethod[];

}
