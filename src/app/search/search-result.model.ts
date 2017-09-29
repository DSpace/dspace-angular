import { DSpaceObject } from '../core/shared/dspace-object.model';
import { Metadatum } from '../core/shared/metadatum.model';
import { ListableObject } from '../object-list/listable-object/listable-object.model';

export class SearchResult<T extends DSpaceObject> implements ListableObject {

  dspaceObject: T;
  hitHighlights: Metadatum[];

}
