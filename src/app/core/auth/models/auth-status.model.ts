import { AuthError } from './auth-error.model';
import { AuthTokenInfo } from './auth-token-info.model';
import { DSpaceObject } from '../../shared/dspace-object.model';
import { Eperson } from '../../eperson/models/eperson.model';

export class AuthStatus {

  id: string;

  okay: boolean;

  authenticated: boolean;

  error?: AuthError;

  eperson: Eperson[];

  token?: AuthTokenInfo;

  self: string;
}
