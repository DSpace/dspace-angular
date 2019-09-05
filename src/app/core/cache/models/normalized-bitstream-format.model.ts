import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { BitstreamFormat } from '../../shared/bitstream-format.model';

import { mapsTo } from '../builders/build-decorators';
import { IDToUUIDSerializer } from '../id-to-uuid-serializer';
import { NormalizedObject } from './normalized-object.model';
import { BitstreamFormatSupportLevel } from '../../shared/bitstream-format-support-level';

/**
 * Normalized model class for a Bitstream Format
 */
@mapsTo(BitstreamFormat)
@inheritSerialization(NormalizedObject)
export class NormalizedBitstreamFormat extends NormalizedObject<BitstreamFormat> {
  /**
   * Short description of this Bitstream Format
   */
  @autoserialize
  shortDescription: string;

  /**
   * Description of this Bitstream Format
   */
  @autoserialize
  description: string;

  /**
   * String representing the MIME type of this Bitstream Format
   */
  @autoserialize
  mimetype: string;

  /**
   * The level of support the system offers for this Bitstream Format
   */
  @autoserialize
  supportLevel: BitstreamFormatSupportLevel;

  /**
   * True if the Bitstream Format is used to store system information, rather than the content of items in the system
   */
  @autoserialize
  internal: boolean;

  /**
   * String representing this Bitstream Format's file extension
   */
  @autoserialize
  extensions: string[];

  /**
   * Identifier for this Bitstream Format
   * Note that this ID is unique for bitstream formats,
   * but might not be unique across different object types
   */
  @autoserialize
  id: string;

  /**
   * Universally unique identifier for this Bitstream Format
   * Consist of a prefix and the id field to ensure the identifier is unique across all object types
   */
  @autoserializeAs(new IDToUUIDSerializer('bitstream-format'), 'id')
  uuid: string;
}
