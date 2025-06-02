import { HttpHeaders } from '@angular/common/http';
import {
  Inject,
  Injectable,
  Optional,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  REQUEST,
  RESPONSE,
} from '../../../express.tokens';
import { AppState } from '../../app.reducer';
import {
  hasValue,
  isNotEmpty,
} from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RemoteData } from '../data/remote-data';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { EPersonDataService } from '../eperson/eperson-data.service';
import { CookieService } from '../services/cookie.service';
import { HardRedirectService } from '../services/hard-redirect.service';
import { RouteService } from '../services/route.service';
import {
  NativeWindowRef,
  NativeWindowService,
} from '../services/window.service';
import {
  AuthService,
  LOGIN_ROUTE,
} from './auth.service';
import { AuthRequestService } from './auth-request.service';
import { AuthStatus } from './models/auth-status.model';
import { AuthTokenInfo } from './models/auth-token-info.model';

/**
 * The auth service.
 */
@Injectable()
export class ServerAuthService extends AuthService {

  constructor(
    @Inject(REQUEST) protected req: any,
    @Optional() @Inject(RESPONSE) private response: any,
    @Inject(NativeWindowService) protected _window: NativeWindowRef,
    protected authRequestService: AuthRequestService,
    protected epersonService: EPersonDataService,
    protected router: Router,
    protected routeService: RouteService,
    protected storage: CookieService,
    protected store: Store<AppState>,
    protected hardRedirectService: HardRedirectService,
    protected notificationService: NotificationsService,
    protected translateService: TranslateService,
  ) {
    super(
      _window,
      authRequestService,
      epersonService,
      router,
      routeService,
      storage,
      store,
      hardRedirectService,
      notificationService,
      translateService,
    );
  }

  /**
   * Returns the authenticated user
   * @returns {User}
   */
  public authenticatedUser(token: AuthTokenInfo): Observable<string> {
    // Determine if the user has an existing auth session on the server
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();

    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', `Bearer ${token.accessToken}`);

    options.headers = headers;
    return this.authRequestService.getRequest('status', options).pipe(
      map((rd: RemoteData<AuthStatus>) => {
        const status = rd.payload;
        if (hasValue(status) && status.authenticated) {
          return status._links.eperson.href;
        } else {
          throw (new Error('Not authenticated'));
        }
      }));
  }

  /**
   * Checks if token is present into the request cookie
   */
  public checkAuthenticationCookie(): Observable<AuthStatus> {
    // Determine if the user has an existing auth session on the server
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    if (isNotEmpty(this.req.protocol) && isNotEmpty(this.req.header('host'))) {
      const referer = this.req.protocol + '://' + this.req.header('host') + this.req.path;
      // use to allow the rest server to identify the real origin on SSR
      headers = headers.append('X-Requested-With', referer);
    }
    options.headers = headers;
    options.withCredentials = true;
    return this.authRequestService.getRequest('status', options).pipe(
      map((rd: RemoteData<AuthStatus>) => Object.assign(new AuthStatus(), rd.payload)),
    );
  }

  override redirectToLoginWhenTokenExpired() {
    const redirectUrl = LOGIN_ROUTE + '?expired=true';
    if (this._window.nativeWindow.location) {
      // Hard redirect to login page, so that all state is definitely lost
      this._window.nativeWindow.location.href = redirectUrl;
    } else if (this.response) {
      if (!this.response._headerSent) {
        this.response.redirect(302, redirectUrl);
      }
    } else {
      this.router.navigateByUrl(redirectUrl);
    }
  }
}
