import { IntegrationModel } from './integration.model';
import { autoserialize } from 'cerialize';

export class AuthorityModel extends IntegrationModel {

  @autoserialize
  id: string;

  @autoserialize
  display: string;

  @autoserialize
  value: string;

  @autoserialize
  otherInformation: any;

  @autoserialize
  language: string
}
