import { autoserialize } from 'cerialize';
import { hasValue } from '../../shared/empty.util';

const VIRTUAL_METADATA_PREFIX = 'virtual::';

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

  /**
   * The authority confidence value
   */
  @autoserialize
  confidence: number;

  /**
   * Returns true if this Metadatum's authority key starts with 'virtual::'
   */
  get isVirtual(): boolean {
    return hasValue(this.authority) && this.authority.startsWith(VIRTUAL_METADATA_PREFIX);
  }

  /**
   * If this is a virtual Metadatum, it returns everything in the authority key after 'virtual::'.
   * Returns undefined otherwise.
   */
  get virtualValue(): string {
    if (this.isVirtual) {
      return this.authority.substring(this.authority.indexOf(VIRTUAL_METADATA_PREFIX) + VIRTUAL_METADATA_PREFIX.length);
    } else {
      return undefined;
    }
  }

}
