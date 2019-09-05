import { CacheableObject, TypedObject } from '../cache/object-cache.reducer';
import { ResourceType } from './resource-type';
import { BitstreamFormatSupportLevel } from './bitstream-format-support-level';

/**
 * Model class for a Bitstream Format
 */
export class BitstreamFormat implements CacheableObject {
  static type = new ResourceType('bitstreamformat');

  bitstreamformat
  /**
   * Short description of this Bitstream Format
   */
  shortDescription: string;

  /**
   * Description of this Bitstream Format
   */
  description: string;

  /**
   * String representing the MIME type of this Bitstream Format
   */
  mimetype: string;

  /**
   * The level of support the system offers for this Bitstream Format
   */
  supportLevel: BitstreamFormatSupportLevel;

  /**
   * True if the Bitstream Format is used to store system information, rather than the content of items in the system
   */
  internal: boolean;

  /**
   * String representing this Bitstream Format's file extension
   */
  extensions: string[];

  /**
   * The link to the rest endpoint where this Bitstream Format can be found
   */
  self: string;

  /**
   * Universally unique identifier for this Bitstream Format
   */
  uuid: string;

  /**
   * Identifier for this Bitstream Format
   * Note that this ID is unique for bitstream formats,
   * but might not be unique across different object types
   */
  id: string;

}
