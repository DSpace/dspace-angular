import { AuthType } from './auth-type';
import { GenericConstructor } from '../shared/generic-constructor';
import { NormalizedAuthStatus } from './models/normalized-auth-status.model';
import { NormalizedEperson } from '../eperson/models/NormalizedEperson.model';
import { NormalizedObject } from '../cache/models/normalized-object.model';

export class AuthObjectFactory {
  public static getConstructor(type): GenericConstructor<NormalizedObject> {
    switch (type) {
      case AuthType.Eperson: {
        return NormalizedEperson
      }

      case AuthType.Status: {
        return NormalizedAuthStatus
      }

      default: {
        return undefined;
      }
    }
  }
}
