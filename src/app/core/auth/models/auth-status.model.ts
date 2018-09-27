import { AuthError } from './auth-error.model';
import { AuthTokenInfo } from './auth-token-info.model';
import { EPerson } from '../../eperson/models/eperson.model';
import { RemoteData } from '../../data/remote-data';
import { Observable } from 'rxjs/internal/Observable';

export class AuthStatus {

  id: string;

  okay: boolean;

  authenticated: boolean;

  error?: AuthError;

  eperson: Observable<RemoteData<EPerson>>;

  token?: AuthTokenInfo;

  self: string;
}
