import { autoserialize } from 'cerialize';

export class Metadatum {

  /**
   * The metadata field of this Metadatum
   */
  @autoserialize
  key: string;

  /**
   * The language of this Metadatum
   */
  @autoserialize
  language: string;

  /**
   * The value of this Metadatum
   */
  @autoserialize
  value: string;

  /**
   * The place of this Metadatum within his list of metadata
   * This is used to render metadata in a specific custom order
   */
  @autoserialize
  place: number;

  /**
   * The authority key used for authority-controlled metadata
   */
  @autoserialize
  authority: string;

}
