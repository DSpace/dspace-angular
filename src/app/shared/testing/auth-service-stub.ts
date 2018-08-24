import { AuthStatus } from '../../core/auth/models/auth-status.model';
import { Observable } from 'rxjs';
import { AuthTokenInfo } from '../../core/auth/models/auth-token-info.model';
import { EpersonMock } from './eperson-mock';
import { Eperson } from '../../core/eperson/models/eperson.model';

export class AuthServiceStub {

  token: AuthTokenInfo = new AuthTokenInfo('token_test');
  private _tokenExpired = false;

  constructor() {
    this.token.expires = Date.now() + (1000 * 60 * 60);
  }

  public authenticate(user: string, password: string): Observable<AuthStatus> {
    if (user === 'user' && password === 'password') {
      const authStatus = new AuthStatus();
      authStatus.okay = true;
      authStatus.authenticated = true;
      authStatus.token = this.token;
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

  public buildAuthHeader(token?: AuthTokenInfo): string {
    return `Bearer ${token.accessToken}`;
  }

  public getToken(): AuthTokenInfo {
    return this.token;
  }

  public hasValidAuthenticationToken(): Observable<AuthTokenInfo> {
    return Observable.of(this.token);
  }

  public logout(): Observable<boolean> {
    return Observable.of(true);
  }

  public isTokenExpired(token?: AuthTokenInfo): boolean {
    return this._tokenExpired;
  }

  /**
   * This method is used to ease testing
   */
  public setTokenAsExpired() {
    this._tokenExpired = true
  }

  /**
   * This method is used to ease testing
   */
  public setTokenAsNotExpired() {
    this._tokenExpired = false
  }

  public isTokenExpiring(): Observable<boolean> {
    return Observable.of(false);
  }

  public refreshAuthenticationToken(token: AuthTokenInfo): Observable<AuthTokenInfo> {
    return Observable.of(this.token);
  }

  public redirectToPreviousUrl() {
    return;
  }

  public removeToken() {
    return;
  }

  setRedirectUrl(url: string) {
    return;
  }

  public storeToken(token: AuthTokenInfo) {
    return;
  }
}
