import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { BrowseEntry } from './browse-entry.model';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { mapsTo } from '../cache/builders/build-decorators';

/**
 * Class object representing a browse entry
 * This class is not normalized because browse entries do not have self links
 */
@mapsTo(BrowseEntry)
@inheritSerialization(NormalizedObject)
export class NormalizedBrowseEntry extends NormalizedObject<BrowseEntry> {
  /**
   * The authority string of this browse entry
   */
  @autoserialize
  authority: string;

  /**
   * The value of this browse entry
   */
  @autoserialize
  value: string;

  /**
   * The language of the value of this browse entry
   */
  @autoserializeAs('valueLang')
  language: string;

  /**
   * The count of this browse entry
   */
  @autoserialize
  count: number;
}
