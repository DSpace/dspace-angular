import { DSpaceObject } from '../../shared/dspace-object.model';
import { Group } from './group.model';

export class EPerson extends DSpaceObject {

  public handle: string;

  public groups: Group[];

  public netid: string;

  public lastActive: string;

  public canLogIn: boolean;

  public email: string;

  public requireCertificate: boolean;

  public selfRegistered: boolean;

  /** Getter to retrieve the EPerson's full name as a string */
  get name(): string {
    return this.firstMetadataValue('eperson.firstname') + ' ' + this.firstMetadataValue('eperson.lastname');
  }
}
