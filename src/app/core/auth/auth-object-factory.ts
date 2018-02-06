
import { AuthType } from './auth-type';
import { AuthStatus } from './models/auth-status.model';
import { GenericConstructor } from '../shared/generic-constructor';
import { DSpaceObject } from '../shared/dspace-object.model';

export class AuthObjectFactory {
  public static getConstructor(type): GenericConstructor<DSpaceObject> {
    switch (type) {
      case AuthType.Status: {
        return AuthStatus
      }

      default: {
        return undefined;
      }
    }
  }
}
