import { ResourceType } from './resource-type';
import { CacheableObject } from '../cache/object-cache.reducer';

/**
 * Model class for a Bitstream Format
 */
export class BitstreamFormat implements CacheableObject {

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
  supportLevel: number;

  /**
   * True if the Bitstream Format is used to store system information, rather than the content of items in the system
   */
  internal: boolean;

  /**
   * String representing this Bitstream Format's file extension
   */
  extensions: string;

  /**
   * The link to the rest endpoint where this Bitstream Format can be found
   */
  self: string;

  /**
   * A ResourceType representing the kind of Object of this BitstreamFormat
   */
  type: ResourceType;

  /**
   * Universally unique identifier for this Bitstream Format
   */
  uuid: string;

}
