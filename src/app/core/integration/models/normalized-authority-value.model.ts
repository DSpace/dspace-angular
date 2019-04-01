import { autoserialize, inheritSerialization } from 'cerialize';
import { IntegrationModel } from './integration.model';
import { mapsTo } from '../../cache/builders/build-decorators';
import { AuthorityValue } from './authority.value';

/**
 * Normalized model class for an Authority Value
 */
@mapsTo(AuthorityValue)
@inheritSerialization(IntegrationModel)
export class NormalizedAuthorityValue extends IntegrationModel {

  @autoserialize
  id: string;

  @autoserialize
  display: string;

  @autoserialize
  value: string;

  @autoserialize
  otherInformation: any;

  @autoserialize
  language: string;

}
