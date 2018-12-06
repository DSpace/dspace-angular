import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';

import { AuthStatus } from './auth-status.model';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { IDToUUIDSerializer } from '../../cache/id-to-uuid-serializer';
import { NormalizedObject } from '../../cache/models/normalized-object.model';
import { ResourceType } from '../../shared/resource-type';

@mapsTo(AuthStatus)
@inheritSerialization(NormalizedObject)
export class NormalizedAuthStatus extends NormalizedObject {
  @autoserialize
  id: string;

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

  @relationship(ResourceType.EPerson, false)
  @autoserialize
  eperson: string;
}
