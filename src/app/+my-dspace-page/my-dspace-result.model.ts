import { DSpaceObject } from '../core/shared/dspace-object.model';
import { Metadatum } from '../core/shared/metadatum.model';
import { ListableObject } from '../shared/object-collection/shared/listable-object.model';

export class MyDSpaceResult<T extends DSpaceObject> implements ListableObject {

  dspaceObject: T;
  hitHighlights: Metadatum[];

}
