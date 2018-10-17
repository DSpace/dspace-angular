import { IntegrationModel } from './integration.model';
import { autoserialize } from 'cerialize';
import { isNotEmpty } from '../../../shared/empty.util';

export class AuthorityValue extends IntegrationModel {

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

  @autoserialize
  hasValue(): boolean {
    return isNotEmpty(this.value);
  }
}
