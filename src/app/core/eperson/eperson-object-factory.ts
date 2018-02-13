import { DSpaceObject } from '../shared/dspace-object.model';
import { Eperson } from './models/eperson.model';
import { EpersonType } from './eperson-type';
import { GenericConstructor } from '../shared/generic-constructor';
import { Group } from './models/group.model';

export class EpersonObjectFactory {
  public static getConstructor(type): GenericConstructor<DSpaceObject> {
    switch (type) {
      case EpersonType.EpersonsModel: {
        return Eperson
      }
      case EpersonType.GroupsModel: {
        return Group
      }
      default: {
        return undefined;
      }
    }
  }
}
