import {
  autoserialize,
  deserialize,
  deserializeAs,
} from 'cerialize';
import { Observable } from 'rxjs';

import {
  link,
  typedObject,
} from '../../cache';
import { CacheableObject } from '../../cache';
import { IDToUUIDSerializer } from '../../cache';
import { PaginatedList } from '../../data';
import { RemoteData } from '../../data';
import { EPerson } from '../../eperson';
import { EPERSON } from '../../eperson';
import { Group } from '../../eperson';
import { GROUP } from '../../eperson';
import { HALLink } from '../../shared';
import { ResourceType } from '../../shared';
import { excludeFromEquals } from '../../utilities';
import { AuthMethod } from './auth.method';
import { AuthError } from './auth-error.model';
import { AUTH_STATUS } from './auth-status.resource-type';
import { AuthTokenInfo } from './auth-token-info.model';

/**
 * Object that represents the authenticated status of a user
 */
@typedObject
export class AuthStatus implements CacheableObject {
  static type = AUTH_STATUS;

  /**
   * The unique identifier of this auth status
   */
  @autoserialize
  id: string;

  /**
   * The type for this AuthStatus
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The UUID of this auth status
   * This UUID is generated client-side and isn't used by the backend.
   * It is based on the ID, so it will be the same for each refresh.
   */
  @deserializeAs(new IDToUUIDSerializer('auth-status'), 'id')
    uuid: string;

  /**
   * True if REST API is up and running, should never return false
   */
  @autoserialize
  okay: boolean;

  /**
   * If the auth status represents an authenticated state
   */
  @autoserialize
  authenticated: boolean;

  /**
   * The {@link HALLink}s for this AuthStatus
   */
  @deserialize
  _links: {
    self: HALLink;
    eperson: HALLink;
    specialGroups: HALLink;
  };

  /**
   * The EPerson of this auth status
   * Will be undefined unless the eperson {@link HALLink} has been resolved.
   */
  @link(EPERSON)
  eperson?: Observable<RemoteData<EPerson>>;

  /**
   * The SpecialGroup of this auth status
   * Will be undefined unless the SpecialGroup {@link HALLink} has been resolved.
   */
  @link(GROUP, true)
  specialGroups?: Observable<RemoteData<PaginatedList<Group>>>;

  /**
   * True if the token is valid, false if there was no token or the token wasn't valid
   */
  @autoserialize
  token?: AuthTokenInfo;

  /**
   * Authentication error if there was one for this status
   */
  // TODO should be refactored to use the RemoteData error
  @autoserialize
  error?: AuthError;

  /**
   * All authentication methods enabled at the backend
   */
  @autoserialize
  authMethods: AuthMethod[];

}
