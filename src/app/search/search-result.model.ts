import { DSpaceObject } from '../core/shared/dspace-object.model';
import { Metadatum } from '../core/shared/metadatum.model';

export class SearchResult<T extends DSpaceObject>{

  dspaceObject: T;
  hitHighlights: Metadatum[];

}
