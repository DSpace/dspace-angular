import { Metadatum } from '../core/shared/metadatum.model';
import { ListableObject } from '../shared/object-collection/shared/listable-object.model';
import { DSpaceObject } from '../core/shared/dspace-object.model';

export class MyDSpaceResult<T extends DSpaceObject> implements ListableObject {

  dspaceObject: T;
  hitHighlights: Metadatum[];

}
