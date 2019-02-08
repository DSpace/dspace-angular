import { autoserialize } from 'cerialize';
import * as uuidv4 from 'uuid/v4';

export class Metadatum {

  uuid: string = uuidv4();
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
