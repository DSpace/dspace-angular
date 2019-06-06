import { inheritSerialization, deserialize, autoserialize, autoserializeAs } from 'cerialize';

import { NormalizedDSpaceObject } from './normalized-dspace-object.model';
import { Item } from '../../shared/item.model';
import { mapsTo, relationship } from '../builders/build-decorators';
import { ResourceType } from '../../shared/resource-type';

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
   * An array of Collections that are direct parents of this Item
   */
  @deserialize
  @relationship(ResourceType.Collection, true)
  parents: string[];

  /**
   * The Collection that owns this Item
   */
  @deserialize
  @relationship(ResourceType.Collection, false)
  owningCollection: string;

  /**
   * List of Bitstreams that are owned by this Item
   */
  @deserialize
  @relationship(ResourceType.Bitstream, true)
  bitstreams: string[];

  @autoserialize
  @relationship(ResourceType.Relationship, true)
  relationships: string[];

}
