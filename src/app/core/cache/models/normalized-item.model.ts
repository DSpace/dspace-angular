import { inheritSerialization, autoserialize, autoserializeAs } from 'cerialize';

import { NormalizedDSpaceObject } from './normalized-dspace-object.model';
import { Item } from '../../shared/item.model';
import { mapsTo, relationship } from '../builders/build-decorators';
import { ResourceType } from '../../shared/resource-type';

@mapsTo(Item)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedItem extends NormalizedDSpaceObject {

  /**
   * A string representing the unique handle of this Item
   */
  @autoserialize
  handle: string;

  /**
   * The Date of the last modification of this Item
   */
  @autoserialize
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
  @autoserialize
  @relationship(ResourceType.Collection, true)
  parents: string[];

  /**
   * The Collection that owns this Item
   */
  @autoserialize
  @relationship(ResourceType.Collection, false)
  owningCollection: string;

  @autoserialize
  @relationship(ResourceType.Bitstream, true)
  bitstreams: string[];

}
