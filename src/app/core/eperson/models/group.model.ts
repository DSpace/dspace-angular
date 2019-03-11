import { DSpaceObject } from '../../shared/dspace-object.model';

export class Group extends DSpaceObject {

  public groups: Group[];

  public handle: string;

  public name: string;

  public permanent: boolean;
}
