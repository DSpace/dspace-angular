import { autoserialize, inheritSerialization } from 'cerialize';
import { Bitstream } from '../../shared/bitstream.model';
import { Bundle } from '../../shared/bundle.model';
import { mapsTo, relationship } from '../builders/build-decorators';

import { NormalizedDSpaceObject } from './normalized-dspace-object.model';

/**
 * Normalized model class for a DSpace Bundle
 */
@mapsTo(Bundle)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedBundle extends NormalizedDSpaceObject<Bundle> {

  /**
   * The bundle's name
   */
  @autoserialize
  name: string;

  /**
   * The primary bitstream of this Bundle
   */
  @autoserialize
  @relationship(Bitstream, false, false)
  primaryBitstream: string;

  /**
   * List of Bitstreams that are part of this Bundle
   */
  @autoserialize
  @relationship(Bitstream, true, false)
  bitstreams: string[];

}
