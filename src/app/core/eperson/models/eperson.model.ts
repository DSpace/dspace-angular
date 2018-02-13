import { DSpaceObject } from '../../shared/dspace-object.model';
import { Group } from './group.model';

export class Eperson extends DSpaceObject {

  public handle: string;

  public groups: Group[];

  public netid: string;

  public lastActive: string;

  public canLogIn: boolean;

  public email: string;

  public requireCertificate: boolean;

  public selfRegistered: boolean;

}
