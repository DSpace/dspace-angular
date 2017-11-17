import { GenericConstructor } from '../shared/generic-constructor';
import { EpersonModel } from './models/eperson.model';
import { EpersonType } from './eperson-type';
import { EpersonsModel } from './models/epersons.model';
import { GroupsModel } from './models/groups.model';

export class EpersonObjectFactory {
  public static getConstructor(type): GenericConstructor<EpersonModel> {
    switch (type) {
      case EpersonType.EpersonsModel: {
        return EpersonsModel
      }
      case EpersonType.GroupsModel: {
        return GroupsModel
      }
      default: {
        return undefined;
      }
    }
  }
}
