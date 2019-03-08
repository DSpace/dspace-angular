import { autoserialize, deserialize, inheritSerialization } from 'cerialize';

import { NormalizedDSpaceObject } from './normalized-dspace-object.model';
import { Collection } from '../../shared/collection.model';
import { mapsTo, relationship } from '../builders/build-decorators';
import { ResourceType } from '../../shared/resource-type';

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
  @relationship(ResourceType.License, false)
  license: string;

  /**
   * The Bitstream that represents the default Access Conditions of this Collection
   */
  @autoserialize
  @relationship(ResourceType.ResourcePolicy, false)
  defaultAccessConditions: string;

  /**
   * The Bitstream that represents the logo of this Collection
   */
  @deserialize
  @relationship(ResourceType.Bitstream, false)
  logo: string;

  /**
   * An array of Communities that are direct parents of this Collection
   */
  @deserialize
  @relationship(ResourceType.Community, true)
  parents: string[];

  /**
   * The Community that owns this Collection
   */
  @deserialize
  @relationship(ResourceType.Community, false)
  owner: string;

  /**
   * List of Items that are part of (not necessarily owned by) this Collection
   */
  @deserialize
  @relationship(ResourceType.Item, true)
  items: string[];

}
