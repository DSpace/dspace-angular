/* tslint:disable:no-empty */
import { Observable, of as observableOf } from 'rxjs';

export class AuthServiceMock {
  public checksAuthenticationToken() {
    return
  }
  public buildAuthHeader() {
    return 'auth-header';
  }

  public getShortlivedToken(): Observable<string> {
    return observableOf('token');
  }
}
