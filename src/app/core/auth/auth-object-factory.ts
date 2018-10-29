import { AuthType } from './auth-type';
import { GenericConstructor } from '../shared/generic-constructor';
import { NormalizedAuthStatus } from './models/normalized-auth-status.model';
import { NormalizedEPerson } from '../eperson/models/normalized-eperson.model';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { EPerson } from '../eperson/models/eperson.model';

export class AuthObjectFactory {
  public static getConstructor(type): GenericConstructor<NormalizedObject> {
    switch (type) {
      case AuthType.EPerson: {
        return NormalizedEPerson
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
