import { autoserialize, deserialize, inheritSerialization } from 'cerialize';
import { Bitstream } from '../../shared/bitstream.model';
import { Collection } from '../../shared/collection.model';
import { Item } from '../../shared/item.model';
import { ResourcePolicy } from '../../shared/resource-policy.model';
import { mapsTo, relationship } from '../builders/build-decorators';

import { NormalizedDSpaceObject } from './normalized-dspace-object.model';

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
  license: string;

  /**
   * The Bitstream that represents the default Access Conditions of this Collection
   */
  @autoserialize
  @relationship(ResourcePolicy, false, false)
  defaultAccessConditions: string;

  /**
   * The Bitstream that represents the logo of this Collection
   */
  @deserialize
  @relationship(Bitstream, false, false)
  logo: string;

  /**
   * List of Items that are part of (not necessarily owned by) this Collection
   */
  @deserialize
  @relationship(Item, true, false)
  items: string[];

}
