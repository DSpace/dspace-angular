import { Observable } from 'rxjs';
import { HttpOptions } from '../../core/dspace-rest-v2/dspace-rest-v2.service';
import { AuthStatus } from '../../core/auth/models/auth-status.model';
import { AuthTokenInfo } from '../../core/auth/models/auth-token-info.model';
import { Eperson } from '../../core/eperson/models/eperson.model';
import { isNotEmpty } from '../empty.util';
import { EpersonMock } from './eperson-mock';

export class AuthRequestServiceStub {
  protected mockUser: Eperson = EpersonMock;
  protected mockTokenInfo = new AuthTokenInfo('test_token');

  public postToEndpoint(method: string, body: any, options?: HttpOptions): Observable<any> {
    const authStatusStub: AuthStatus = new AuthStatus();
    if (isNotEmpty(body)) {
      const parsedBody = this.parseQueryString(body);
      authStatusStub.okay = true;
      if (parsedBody.user === 'user' && parsedBody.password === 'password') {
        authStatusStub.authenticated = true;
        authStatusStub.token = this.mockTokenInfo;
      } else {
        authStatusStub.authenticated = false;
      }
    } else {
      const token = (options.headers as any).lazyUpdate[1].value;
      if (this.validateToken(token)) {
        authStatusStub.authenticated = true;
        authStatusStub.token = this.mockTokenInfo;
        authStatusStub.eperson = [this.mockUser];
      } else {
        authStatusStub.authenticated = false;
      }
    }
    return Observable.of(authStatusStub);
  }

  public getRequest(method: string, options?: HttpOptions): Observable<any> {
    const authStatusStub: AuthStatus = new AuthStatus();
    switch (method) {
      case 'logout':
        authStatusStub.authenticated = false;
        break;
      case 'status':
        const token = (options.headers as any).lazyUpdate[1].value;
        if (this.validateToken(token)) {
          authStatusStub.authenticated = true;
          authStatusStub.token = this.mockTokenInfo;
          authStatusStub.eperson = [this.mockUser];
        } else {
          authStatusStub.authenticated = false;
        }
        break;
    }
    return Observable.of(authStatusStub);
  }

  private validateToken(token): boolean {
    return (token === 'Bearer test_token');
  }
  private parseQueryString(query): any {
    const obj = Object.create({});
    const vars = query.split('&');
    for (const param of vars) {
      const pair = param.split('=');
      obj[pair[0]] = pair[1]
    }
    return obj;
  }
}
