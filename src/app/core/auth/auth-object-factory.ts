import { AuthType } from './auth-type';
import { GenericConstructor } from '../shared/generic-constructor';
import { NormalizedAuthStatus } from './models/normalized-auth-status.model';
import { NormalizedDSpaceObject } from '../cache/models/normalized-dspace-object.model';
import { NormalizedEpersonModel } from '../eperson/models/NormalizedEperson.model';

export class AuthObjectFactory {
  public static getConstructor(type): GenericConstructor<NormalizedDSpaceObject> {
    switch (type) {
      case AuthType.Eperson: {
        return NormalizedEpersonModel
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
