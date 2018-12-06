import { autoserialize } from 'cerialize';
import { IntegrationModel } from './integration.model';

export class AuthorityValueModel extends IntegrationModel {

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
