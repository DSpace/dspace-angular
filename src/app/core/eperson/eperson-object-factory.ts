import { EpersonType } from './eperson-type';
import { GenericConstructor } from '../shared/generic-constructor';
import { NormalizedEpersonModel } from './models/NormalizedEperson.model';
import { NormalizedGroupModel } from './models/NormalizedGroup.model';
import { NormalizedObject } from '../cache/models/normalized-object.model';

export class EpersonObjectFactory {
  public static getConstructor(type): GenericConstructor<NormalizedObject> {
    switch (type) {
      case EpersonType.EpersonsModel: {
        return NormalizedEpersonModel
      }
      case EpersonType.GroupsModel: {
        return NormalizedGroupModel
      }
      default: {
        return undefined;
      }
    }
  }
}
