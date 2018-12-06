import { autoserialize, inheritSerialization } from 'cerialize';

import { Group } from './group.model';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { mapsTo } from '../../cache/builders/build-decorators';
import { NormalizedDSpaceObject } from '../../cache/models/normalized-dspace-object.model';
import { CacheableObject } from '../../cache/object-cache.reducer';

@mapsTo(Group)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedGroup extends NormalizedDSpaceObject implements CacheableObject, ListableObject {

  @autoserialize
  public handle: string;

  @autoserialize
  public permanent: boolean;
}
