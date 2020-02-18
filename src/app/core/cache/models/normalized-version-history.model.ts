import { autoserialize, deserialize, inheritSerialization } from 'cerialize';
import { NormalizedObject } from './normalized-object.model';
import { TypedObject } from '../object-cache.reducer';
import { mapsTo, relationship } from '../builders/build-decorators';
import { VersionHistory } from '../../shared/version-history.model';
import { Version } from '../../shared/version.model';

/**
 * Normalized model class for a DSpace Version History
 */
@mapsTo(VersionHistory)
@inheritSerialization(NormalizedObject)
export class NormalizedVersionHistory extends NormalizedObject<VersionHistory> implements TypedObject {
  /**
   * The identifier of this Version History
   */
  @autoserialize
  id: number;

  /**
   * The list of versions within this history
   */
  @deserialize
  @relationship(Version, true)
  versions: string[];
}
