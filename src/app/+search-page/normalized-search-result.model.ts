import { autoserialize } from 'cerialize';
import { Metadatum } from '../core/shared/metadatum.model';
import { ListableObject } from '../shared/object-collection/shared/listable-object.model';

export class NormalizedSearchResult implements ListableObject {

  @autoserialize
  dspaceObject: string;

  @autoserialize
  hitHighlights: Metadatum[];

}
