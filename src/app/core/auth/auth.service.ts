import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Eperson } from '../eperson/models/eperson.model';
import { AuthRequestService } from './auth-request.service';
import { HttpHeaders } from '@angular/common/http';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';

export const MOCK_USER = new Eperson();
MOCK_USER.id = '92a59227-ccf7-46da-9776-86c3fc64147f';
MOCK_USER.uuid = '92a59227-ccf7-46da-9776-86c3fc64147f';
MOCK_USER.name = 'andrea.bollini@4science.it';
MOCK_USER.email = 'andrea.bollini@4science.it';
MOCK_USER.metadata = [
  {
    key: 'eperson.firstname',
    value: 'Andrea',
    language: null
  },
  {
    key: 'eperson.lastname',
    value: 'Bollini',
    language: null
  },
  {
    key: 'eperson.language',
    value: 'en',
    language: null
  }
];

export const TOKENITEM = 'ds-token';

/**
 * The user service.
 */
@Injectable()
export class AuthService {

  /**
   * True if authenticated
   * @type
   */
  private _authenticated = false;

  constructor(private authRequestService: AuthRequestService) {}

  /**
   * Authenticate the user
   *
   * @param {string} user The user name
   * @param {string} password The user's password
   * @returns {Observable<User>} The authenticated user observable.
   */
  public authenticate(user: string, password: string): Observable<Eperson> {
    // Normally you would do an HTTP request to determine to
    // attempt authenticating the user using the supplied credentials.
    // const body = `user=${user}&password=${password}`;
    // const body = encodeURI('password=test&user=vera.aloe@mailinator.com');
    // const body = [{user}, {password}];
    const formData: FormData = new FormData();
    formData.append('user', user);
    formData.append('password', password);
    const body = 'password=' + password.toString() + '&user=' + user.toString();
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.append('Accept', 'application/json');
    options.headers = headers;
    options.responseType = 'text';
    this.authRequestService.postToEndpoint('login', body, options)
      .subscribe((r) => {
        console.log(r);
      })
    if (user === 'test' && password === 'password') {
      this._authenticated = true;
      return Observable.of(MOCK_USER);
    }

    return Observable.throw(new Error('Invalid email or password'));
  }

  /**
   * Determines if the user is authenticated
   * @returns {Observable<boolean>}
   */
  public authenticated(): Observable<boolean> {
    return Observable.of(this._authenticated);
  }

  /**
   * Returns the authenticated user
   * @returns {User}
   */
  public authenticatedUser(): Observable<Eperson> {
    // Normally you would do an HTTP request to determine if
    // the user has an existing auth session on the server
    // but, let's just return the mock user for this example.
    return Observable.of(MOCK_USER);
  }

  /**
   * Create a new user
   * @returns {User}
   */
  public create(user: Eperson): Observable<Eperson> {
    // Normally you would do an HTTP request to POST the user
    // details and then return the new user object
    // but, let's just return the new user for this example.
    this._authenticated = true;
    return Observable.of(user);
  }

  /**
   * End session
   * @returns {Observable<boolean>}
   */
  public signout(): Observable<boolean> {
    // Normally you would do an HTTP request sign end the session
    // but, let's just return an observable of true.
    this._authenticated = false;
    return Observable.of(true);
  }
}
