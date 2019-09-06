import { autoserialize, inheritSerialization } from 'cerialize';
import { IntegrationModel } from './integration.model';
import { mapsTo } from '../../cache/builders/build-decorators';
import { AuthorityEntry } from './authority-entry.model';

/**
 * Normalized model class for an Authority Value
 */
@mapsTo(AuthorityEntry)
@inheritSerialization(IntegrationModel)
export class NormalizedAuthorityEntry extends IntegrationModel {

  /**
   * The identifier of this authority entry
   */
  @autoserialize
  id: string;

  /**
   * The display value of this authority entry
   */
  @autoserialize
  display: string;

  /**
   * The value of this authority entry
   */
  @autoserialize
  value: string;

  /**
   * An object containing additional information related to this authority entry
   */
  @autoserialize
  otherInformation: any;

  /**
   * The language code of this authority value
   */
  @autoserialize
  language: string;

  /**
   * True if the Authority entry is selectable
   */
  @autoserialize
  selectable: boolean;
}
