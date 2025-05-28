import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterReducerState } from '@ngrx/router-store';
import {
  select,
  Store,
} from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of,
  Subscription,
} from 'rxjs';
import {
  filter,
  map,
} from 'rxjs/operators';

import {
  AppState,
  routerStateSelector,
} from '../../app.reducer';
import {
  AuthService,
  LOGIN_ROUTE,
  LOGOUT_ROUTE,
} from '../../core/auth/auth.service';
import {
  isAuthenticated,
  isAuthenticationLoading,
} from '../../core/auth/selectors';
import { EPerson } from '../../core/eperson/models/eperson.model';
import {
  fadeInOut,
  fadeOut,
} from '../animations/fade';
import { isNotUndefined } from '../empty.util';
import { HostWindowService } from '../host-window.service';
import { ThemedLogInComponent } from '../log-in/themed-log-in.component';
import { BrowserOnlyPipe } from '../utils/browser-only.pipe';
import { ThemedUserMenuComponent } from './user-menu/themed-user-menu.component';

@Component({
  selector: 'ds-base-auth-nav-menu',
  templateUrl: './auth-nav-menu.component.html',
  styleUrls: ['./auth-nav-menu.component.scss'],
  animations: [fadeInOut, fadeOut],
  standalone: true,
  imports: [
    AsyncPipe,
    BrowserOnlyPipe,
    NgbDropdownModule,
    NgClass,
    RouterLink,
    RouterLinkActive,
    ThemedLogInComponent,
    ThemedUserMenuComponent,
    TranslateModule,
  ],
})
export class AuthNavMenuComponent implements OnInit {
  /**
   * Whether user is authenticated.
   * @type {Observable<string>}
   */
  public isAuthenticated$: Observable<boolean>;

  /**
   * True if the authentication is loading.
   * @type {boolean}
   */
  public loading: Observable<boolean>;

  public isMobile$: Observable<boolean>;

  public showAuth$ = of(false);

  public user: Observable<EPerson>;

  public sub: Subscription;

  constructor(private store: Store<AppState>,
              private windowService: HostWindowService,
              private authService: AuthService,
  ) {
    this.isMobile$ = this.windowService.isMobile();
  }

  ngOnInit(): void {
    // set isAuthenticated
    this.isAuthenticated$ = this.store.pipe(select(isAuthenticated));

    // set loading
    this.loading = this.store.pipe(select(isAuthenticationLoading));

    this.user = this.authService.getAuthenticatedUserFromStore();

    this.showAuth$ = this.store.pipe(
      select(routerStateSelector),
      filter((router: RouterReducerState) => isNotUndefined(router) && isNotUndefined(router.state)),
      map((router: RouterReducerState) => (!router.state.url.startsWith(LOGIN_ROUTE)
        && !router.state.url.startsWith(LOGOUT_ROUTE)),
      ),
    );
  }
}
