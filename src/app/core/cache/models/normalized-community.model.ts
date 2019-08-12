import { autoserialize, deserialize, inheritSerialization } from 'cerialize';

import { NormalizedDSpaceObject } from './normalized-dspace-object.model';
import { Community } from '../../shared/community.model';
import { mapsTo, relationship } from '../builders/build-decorators';
import { ResourceType } from '../../shared/resource-type';
import { NormalizedBitstream } from './normalized-bitstream.model';
import { NormalizedCollection } from './normalized-collection.model';
import { Bitstream } from '../../shared/bitstream.model';
import { Collection } from '../../shared/collection.model';

/**
 * Normalized model class for a DSpace Community
 */
@mapsTo(Community)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedCommunity extends NormalizedDSpaceObject<Community> {
  /**
   * A string representing the unique handle of this Community
   */
  @autoserialize
  handle: string;

  /**
   * The Bitstream that represents the logo of this Community
   */
  @deserialize
  @relationship(Bitstream, false)
  logo: string;

  /**
   * An array of Communities that are direct parents of this Community
   */
  @deserialize
  @relationship(Community, true)
  parents: string[];

  /**
   * The Community that owns this Community
   */
  @deserialize
  @relationship(Community, false)
  owner: string;

  /**
   * List of Collections that are owned by this Community
   */
  @deserialize
  @relationship(Collection, true)
  collections: string[];

  @deserialize
  @relationship(Community, true)
  subcommunities: string[];

}
