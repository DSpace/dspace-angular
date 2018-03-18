import { AuthError } from './auth-error.model';
import { AuthTokenInfo } from './auth-token-info.model';
import { DSpaceObject } from '../../shared/dspace-object.model';
import { Eperson } from '../../eperson/models/eperson.model';

export class AuthStatus extends DSpaceObject {

  okay: boolean;

  authenticated: boolean;

  error?: AuthError;

  eperson: Eperson[];

  ssoLoginUrl?: string;

  token?: AuthTokenInfo
}
