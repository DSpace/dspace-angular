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

}
