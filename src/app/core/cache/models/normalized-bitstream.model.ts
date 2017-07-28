import { inheritSerialization, autoserialize } from 'cerialize';

import { NormalizedDSpaceObject } from './normalized-dspace-object.model';
import { Bitstream } from '../../shared/bitstream.model';
import { mapsTo, relationship } from '../builders/build-decorators';
import { ResourceType } from '../../shared/resource-type';

@mapsTo(Bitstream)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedBitstream extends NormalizedDSpaceObject {

  /**
   * The size of this bitstream in bytes
   */
  @autoserialize
  sizeBytes: number;

  /**
   * The relative path to this Bitstream's file
   */
  @autoserialize
  content: string;

  /**
   * The mime type of this Bitstream
   */
  @autoserialize
  mimetype: string;

  /**
   * The format of this Bitstream
   */
  @autoserialize
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
  @relationship(ResourceType.Item, true)
  parents: string[];

  /**
   * The Bundle that owns this Bitstream
   */
  @autoserialize
  @relationship(ResourceType.Item, false)
  owner: string;

  /**
   * The name of the Bundle this Bitstream is part of
   */
  @autoserialize
  bundleName: string;

}
