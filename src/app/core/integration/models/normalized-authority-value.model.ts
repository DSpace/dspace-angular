import { autoserialize, inheritSerialization } from 'cerialize';
import { IntegrationModel } from './integration.model';
import { mapsTo } from '../../cache/builders/build-decorators';
import { AuthorityValue } from './authority.value';
import { resourceType } from '../../shared/resource-type.decorator';
import { ResourceType } from '../../shared/resource-type';

/**
 * Normalized model class for an Authority Value
 */
@mapsTo(AuthorityValue)
@inheritSerialization(IntegrationModel)
@resourceType(ResourceType.Authority)
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
