import { autoserialize, inheritSerialization } from 'cerialize';

import { NormalizedDSpaceObject } from './normalized-dspace-object.model';
import { Community } from '../../shared/community.model';
import { ResourceType } from '../../shared/resource-type';
import { mapsTo, relationship } from '../builders/build-decorators';

/**
 * Normalized model class for a DSpace Community
 */
@mapsTo(Community)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedCommunity extends NormalizedDSpaceObject {

  /**
   * A string representing the unique handle of this Community
   */
  @autoserialize
  handle: string;

  /**
   * The Bitstream that represents the logo of this Community
   */
  @autoserialize
  @relationship(ResourceType.Bitstream, false)
  logo: string;

  /**
   * An array of Communities that are direct parents of this Community
   */
  @autoserialize
  @relationship(ResourceType.Community, true)
  parents: string[];

  /**
   * The Community that owns this Community
   */
  @autoserialize
  @relationship(ResourceType.Community, false)
  owner: string;

  /**
   * List of Collections that are owned by this Community
   */
  @autoserialize
  @relationship(ResourceType.Collection, true)
  collections: string[];

  @autoserialize
  @relationship(ResourceType.Community, true)
  subcommunities: string[];

}
