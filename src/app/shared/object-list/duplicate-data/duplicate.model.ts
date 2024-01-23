import { autoserialize } from 'cerialize';
import { MetadataMap } from '../../../core/shared/metadata.models';

export class Duplicate {
  /**
   * The item title
   */
  @autoserialize
  title: string;
  @autoserialize
  uuid: string;
  @autoserialize
  workflowItemId: number;
  @autoserialize
  workspaceItemId: number;
  @autoserialize
  owningCollection: string;

  /**
   * Metadata for the bitstream (e.g. dc.description)
   */
  @autoserialize
  metadata: MetadataMap;
}
