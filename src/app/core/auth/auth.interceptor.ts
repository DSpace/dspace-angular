import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpClient, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';

import { AuthService } from './auth.service';
import { AuthStatus } from './models/auth-status.model';
import { AuthType } from './auth-type';
import { ResourceType } from '../shared/resource-type';
import { AuthTokenInfo } from './models/auth-token-info.model';
import { isNotEmpty } from '../../shared/empty.util';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private inj: Injector, private router: Router) { }

  private isUnauthorized(status: number): boolean {
    return status === 401 || status === 403;
  }

  private isLoginResponse(url: string): boolean {
    return url.endsWith('/authn/login');
  }

  private isLogoutResponse(url: string): boolean {
    return url.endsWith('/authn/logout');
  }

  private makeAuthStatusObject(authenticated:boolean, accessToken?: string, error?: string): AuthStatus {
    const authStatus = new AuthStatus();
    authStatus.id = null;
    authStatus.okay = true;
    if (authenticated) {
      authStatus.authenticated = true;
      authStatus.token = new AuthTokenInfo(accessToken);
    } else {
      authStatus.authenticated = false;
      authStatus.error = JSON.parse(error);
    }
    return authStatus;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authService = this.inj.get(AuthService);

    // Get the auth header from the service.
    const Authorization = authService.getAuthHeader();

    let authReq;
    if (isNotEmpty(Authorization)) {
      // Clone the request to add the new header.
       authReq = req.clone({headers: req.headers.set('authorization', Authorization)});
    } else {
       authReq = req.clone();
    }

    // Pass on the cloned request instead of the original request.
    return next.handle(authReq)
      .map((response) => {
        if (response instanceof HttpResponse && response.status === 200 && (this.isLoginResponse(response.url) || this.isLogoutResponse(response.url))) {
          let authRes: HttpResponse<any>;
          if (this.isLoginResponse(response.url)) {
            const token = response.headers.get('authorization');
            authRes = response.clone({body: this.makeAuthStatusObject(true, token)});
          } else {
            authRes = response.clone({body: this.makeAuthStatusObject(false)});
          }
          return authRes;
        } else {
          return response;
        }
      })
      .catch((error, caught) => {
        // Intercept an unauthorized error response
        if (error instanceof HttpErrorResponse && this.isUnauthorized(error.status)) {
          // Create a new HttpResponse and return it, so it can be handle properly by AuthService.
          const authResponse = new HttpResponse({
            body: this.makeAuthStatusObject(false, null, error.error),
            headers: error.headers,
            status: error.status,
            statusText: error.statusText,
            url: error.url
          });
          return Observable.of(authResponse);
        } else {
          // Return error response as is.
          return Observable.throw(error);
        }
      }) as any;
  }
}
