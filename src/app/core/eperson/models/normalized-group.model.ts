import { autoserialize, inheritSerialization } from 'cerialize';
import { CacheableObject } from '../../cache/object-cache.reducer';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { NormalizedDSpaceObject } from '../../cache/models/normalized-dspace-object.model';
import { mapsTo } from '../../cache/builders/build-decorators';
import { Group } from './group.model';

@mapsTo(Group)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedGroup extends NormalizedDSpaceObject<Group> implements CacheableObject, ListableObject {

  @autoserialize
  public handle: string;

  @autoserialize
  public name: string;

  @autoserialize
  public permanent: boolean;
}
