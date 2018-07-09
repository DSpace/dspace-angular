import { AuthStatus } from './auth-status.model';
import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { mapsTo } from '../../cache/builders/build-decorators';
import { NormalizedDSpaceObject } from '../../cache/models/normalized-dspace-object.model';
import { Eperson } from '../../eperson/models/eperson.model';

@mapsTo(AuthStatus)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedAuthStatus extends NormalizedDSpaceObject {

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

  @autoserializeAs(Eperson)
  eperson: Eperson[];

}
