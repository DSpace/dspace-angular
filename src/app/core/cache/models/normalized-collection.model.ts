import { autoserialize, deserialize, inheritSerialization } from 'cerialize';

import { NormalizedDSpaceObject } from './normalized-dspace-object.model';
import { Collection } from '../../shared/collection.model';
import { mapsTo, relationship } from '../builders/build-decorators';
import { NormalizedResourcePolicy } from './normalized-resource-policy.model';
import { NormalizedBitstream } from './normalized-bitstream.model';
import { NormalizedCommunity } from './normalized-community.model';
import { NormalizedItem } from './normalized-item.model';
import { License } from '../../shared/license.model';
import { ResourcePolicy } from '../../shared/resource-policy.model';
import { Bitstream } from '../../shared/bitstream.model';
import { Community } from '../../shared/community.model';
import { Item } from '../../shared/item.model';

/**
 * Normalized model class for a DSpace Collection
 */
@mapsTo(Collection)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedCollection extends NormalizedDSpaceObject<Collection> {

  /**
   * A string representing the unique handle of this Collection
   */
  @autoserialize
  handle: string;

  /**
   * The Bitstream that represents the license of this Collection
   */
  @autoserialize
  @relationship(License, false)
  license: string;

  /**
   * The Bitstream that represents the default Access Conditions of this Collection
   */
  @autoserialize
  @relationship(ResourcePolicy, false)
  defaultAccessConditions: string;

  /**
   * The Bitstream that represents the logo of this Collection
   */
  @deserialize
  @relationship(Bitstream, false)
  logo: string;

  /**
   * An array of Communities that are direct parents of this Collection
   */
  @deserialize
  @relationship(Community, true)
  parents: string[];

  /**
   * The Community that owns this Collection
   */
  @deserialize
  @relationship(Community, false)
  owner: string;

  /**
   * List of Items that are part of (not necessarily owned by) this Collection
   */
  @deserialize
  @relationship(Item, true)
  items: string[];

}
