import { Group } from './group.model';
import { DSpaceObject } from '../../shared/dspace-object.model';

export class EPerson extends DSpaceObject {

  public handle: string;

  public groups: Group[];

  public netid: string;

  public lastActive: string;

  public canLogIn: boolean;

  public email: string;

  public requireCertificate: boolean;

  public selfRegistered: boolean;

}
