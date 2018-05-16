import { AuthStatus } from '../../core/auth/models/auth-status.model';
import { Observable } from 'rxjs/Observable';
import { AuthTokenInfo } from '../../core/auth/models/auth-token-info.model';
import { EpersonMock } from './eperson-mock';
import { Eperson } from '../../core/eperson/models/eperson.model';

export class AuthServiceStub {

  public authenticate(user: string, password: string): Observable<AuthStatus> {
    if (user === 'user' && password === 'password') {
      const authStatus = new AuthStatus();
      authStatus.okay = true;
      authStatus.authenticated = true;
      authStatus.token = new AuthTokenInfo('token_test');
      authStatus.eperson = [EpersonMock];
      return Observable.of(authStatus);
    } else {
      console.log('error');
      throw(new Error('Message Error test'));
    }
  }

  public authenticatedUser(token: AuthTokenInfo): Observable<Eperson> {
    if (token.accessToken === 'token_test') {
      return Observable.of(EpersonMock);
    } else {
      throw(new Error('Message Error test'));
    }
  }

  public hasValidAuthenticationToken(): Observable<AuthTokenInfo> {
    return Observable.of(new AuthTokenInfo('token_test'));
  }

  public logout(): Observable<boolean> {
    return Observable.of(true);
  }

  public refreshAuthenticationToken(token: AuthTokenInfo): Observable<AuthTokenInfo> {
    return Observable.of(new AuthTokenInfo('token_test'));
  }

  public redirectToPreviousUrl() {
    return;
  }

  public removeToken() {
    return;
  }

  public storeToken(token: AuthTokenInfo) {
    return;
  }
}
