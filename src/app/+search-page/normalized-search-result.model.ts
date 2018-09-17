import { autoserialize } from 'cerialize';
import { Metadatum } from '../core/shared/metadatum.model';
import { ListableObject } from '../shared/object-collection/shared/listable-object.model';

/**
 * Represents a normalized version of a search result object of a certain DSpaceObject
 */
export class NormalizedSearchResult implements ListableObject {
  /**
   * The UUID of the DSpaceObject that was found
   */
  @autoserialize
  dspaceObject: string;

  /**
   * The metadata that was used to find this item, hithighlighted
   */
  @autoserialize
  hitHighlights: Metadatum[];

}
