import { autoserialize, inheritSerialization } from 'cerialize';

import { NormalizedDSpaceObject } from './normalized-dspace-object.model';
import { Bitstream } from '../../shared/bitstream.model';
import { mapsTo, relationship } from '../builders/build-decorators';
import { Item } from '../../shared/item.model';
import { BitstreamFormat } from '../../shared/bitstream-format.model';

/**
 * Normalized model class for a DSpace Bitstream
 */
@mapsTo(Bitstream)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedBitstream extends NormalizedDSpaceObject<Bitstream> {
  /**
   * The size of this bitstream in bytes
   */
  @autoserialize
  sizeBytes: number;

  /**
   * The relative path to this Bitstream's file
   */
  @autoserialize
  @relationship(Bitstream, false, false)
  content: string;

  /**
   * The format of this Bitstream
   */
  @autoserialize
  @relationship(BitstreamFormat, false, false)
  format: string;

  /**
   * The description of this Bitstream
   */
  @autoserialize
  description: string;

  /**
   * An array of Bundles that are direct parents of this Bitstream
   */
  @autoserialize
  @relationship(Item, true, false)
  parents: string[];

  /**
   * The Bundle that owns this Bitstream
   */
  @autoserialize
  @relationship(Item, false, false)
  owner: string;

  /**
   * The name of the Bundle this Bitstream is part of
   */
  @autoserialize
  bundleName: string;

}
