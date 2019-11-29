import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { NormalizedObject } from './normalized-object.model';
import { ExternalSourceEntry } from '../../shared/external-source-entry.model';
import { mapsTo } from '../builders/build-decorators';
import { MetadataMap, MetadataMapSerializer } from '../../shared/metadata.models';

@mapsTo(ExternalSourceEntry)
@inheritSerialization(NormalizedObject)
export class NormalizedExternalSourceEntry extends NormalizedObject<ExternalSourceEntry> {
  /**
   * Unique identifier
   */
  @autoserialize
  id: string;

  /**
   * The value to display
   */
  @autoserialize
  display: string;

  /**
   * The value to store the entry with
   */
  @autoserialize
  value: string;

  /**
   * Metadata of the entry
   */
  @autoserializeAs(MetadataMapSerializer)
  metadata: MetadataMap;
}
