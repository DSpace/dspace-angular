import { autoserialize, deserialize, inheritSerialization } from 'cerialize';

import { CacheableObject } from '../../cache/object-cache.reducer';
import { NormalizedDSpaceObject } from '../../cache/models/normalized-dspace-object.model';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { Group } from './group.model';

@mapsTo(Group)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedGroup extends NormalizedDSpaceObject<Group> implements CacheableObject {

  /**
   * List of Groups that this Group belong to
   */
  @deserialize
  @relationship(Group, true)
  groups: string[];

  /**
   * A string representing the unique handle of this Group
   */
  @autoserialize
  public handle: string;

  /**
   * A string representing the name of this Group
   */
  @autoserialize
  public name: string;

  /**
   * A string representing the name of this Group is permanent
   */
  @autoserialize
  public permanent: boolean;
}
