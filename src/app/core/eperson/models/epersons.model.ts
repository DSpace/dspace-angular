import { EpersonModel } from './eperson.model';
import { autoserialize, inheritSerialization } from 'cerialize';

@inheritSerialization(EpersonModel)
export class EpersonsModel extends EpersonModel {

  @autoserialize
  public netid: string;

  @autoserialize
  public lastActive: string;

  @autoserialize
  public canLogIn: boolean;

  @autoserialize
  public email: string;

  @autoserialize
  public requireCertificate: boolean;

  @autoserialize
  public selfRegistered: boolean;
}
