import { autoserialize, inheritSerialization } from 'cerialize';
import { CacheableObject } from '../../cache/object-cache.reducer';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { NormalizedDSpaceObject } from '../../cache/models/normalized-dspace-object.model';
import { Eperson } from './eperson.model';
import { mapsTo } from '../../cache/builders/build-decorators';
import { Group } from './group.model';

@mapsTo(Group)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedGroupModel extends NormalizedDSpaceObject implements CacheableObject, ListableObject {

  @autoserialize
  public handle: string;

  @autoserialize
  public permanent: boolean;
}
