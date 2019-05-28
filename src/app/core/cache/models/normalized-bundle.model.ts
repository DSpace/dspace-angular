import { autoserialize, inheritSerialization } from 'cerialize';

import { NormalizedDSpaceObject } from './normalized-dspace-object.model';
import { Bundle } from '../../shared/bundle.model';
import { mapsTo, relationship } from '../builders/build-decorators';
import { ResourceType } from '../../shared/resource-type';

/**
 * Normalized model class for a DSpace Bundle
 */
@mapsTo(Bundle)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedBundle extends NormalizedDSpaceObject<Bundle> {
  /**
   * The primary bitstream of this Bundle
   */
  @autoserialize
  @relationship(ResourceType.Bitstream, false)
  primaryBitstream: string;

  /**
   * An array of Items that are direct parents of this Bundle
   */
  parents: string[];

  /**
   * The Item that owns this Bundle
   */
  owner: string;

  /**
   * List of Bitstreams that are part of this Bundle
   */
  @autoserialize
  @relationship(ResourceType.Bitstream, true)
  bitstreams: string[];

}
