import { inheritSerialization, deserialize, autoserialize, autoserializeAs } from 'cerialize';

import { NormalizedDSpaceObject } from './normalized-dspace-object.model';
import { Item } from '../../shared/item.model';
import { mapsTo, relationship } from '../builders/build-decorators';
import { Collection } from '../../shared/collection.model';
import { Relationship } from '../../shared/item-relationships/relationship.model';
import { Bundle } from '../../shared/bundle.model';

/**
 * Normalized model class for a DSpace Item
 */
@mapsTo(Item)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedItem extends NormalizedDSpaceObject<Item> {

  /**
   * A string representing the unique handle of this Item
   */
  @autoserialize
  handle: string;

  /**
   * The Date of the last modification of this Item
   */
  @deserialize
  lastModified: Date;

  /**
   * A boolean representing if this Item is currently archived or not
   */
  @autoserializeAs(Boolean, 'inArchive')
  isArchived: boolean;

  /**
   * A boolean representing if this Item is currently discoverable or not
   */
  @autoserializeAs(Boolean, 'discoverable')
  isDiscoverable: boolean;

  /**
   * A boolean representing if this Item is currently withdrawn or not
   */
  @autoserializeAs(Boolean, 'withdrawn')
  isWithdrawn: boolean;

  /**
   * The Collection that owns this Item
   */
  @deserialize
  @relationship(Collection, false, false)
  owningCollection: string;

  /**
   * List of Bitstreams that are owned by this Item
   */
  @deserialize
  @relationship(Bundle, true, false)
  bundles: string[];

  @deserialize
  @relationship(Relationship, true, false)
  relationships: string[];

}
