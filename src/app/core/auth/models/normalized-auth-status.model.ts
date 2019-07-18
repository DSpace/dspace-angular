import { AuthStatus } from './auth-status.model';
import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { NormalizedObject } from '../../cache/models/normalized-object.model';
import { IDToUUIDSerializer } from '../../cache/id-to-uuid-serializer';
import { EPerson } from '../../eperson/models/eperson.model';

@mapsTo(AuthStatus)
@inheritSerialization(NormalizedObject)
export class NormalizedAuthStatus extends NormalizedObject<AuthStatus> {
  /**
   * The unique identifier of this auth status
   */
  @autoserialize
  id: string;

  /**
   * The unique generated uuid of this auth status
   */
  @autoserializeAs(new IDToUUIDSerializer('auth-status'), 'id')
  uuid: string;

  /**
   * True if REST API is up and running, should never return false
   */
  @autoserialize
  okay: boolean;

  /**
   * True if the token is valid, false if there was no token or the token wasn't valid
   */
  @autoserialize
  authenticated: boolean;

  /**
   * The self link to the eperson of this auth status
   */
  @relationship(EPerson, false)
  @autoserialize
  eperson: string;
}
