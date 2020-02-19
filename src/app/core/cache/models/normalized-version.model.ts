import { autoserialize, deserialize, inheritSerialization } from 'cerialize';
import { Version } from '../../shared/version.model';
import { mapsTo, relationship } from '../builders/build-decorators';
import { TypedObject } from '../object-cache.reducer';
import { NormalizedObject } from './normalized-object.model';
import { Item } from '../../shared/item.model';
import { VersionHistory } from '../../shared/version-history.model';
import { EPerson } from '../../eperson/models/eperson.model';

/**
 * Normalized model class for a DSpace Version
 */
@mapsTo(Version)
@inheritSerialization(NormalizedObject)
export class NormalizedVersion extends NormalizedObject<Version> implements TypedObject {
  /**
   * The identifier of this Version
   */
  @autoserialize
  id: number;

  /**
   * The version number of the version's history this version represents
   */
  @autoserialize
  version: number;

  /**
   * The summary for the changes made in this version
   */
  @autoserialize
  summary: string;

  /**
   * The Date this version was created
   */
  @deserialize
  created: Date;

  /**
   * The full version history this version is apart of
   */
  @deserialize
  @relationship(VersionHistory, false)
  versionhistory: string;

  /**
   * The item this version represents
   */
  @deserialize
  @relationship(Item, false)
  item: string;

  /**
   * The e-person who created this version
   */
  @deserialize
  @relationship(EPerson, false)
  eperson: string;
}
