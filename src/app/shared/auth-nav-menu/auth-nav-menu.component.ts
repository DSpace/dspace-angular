import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RouterReducerState } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { fadeInOut, fadeOut } from '../animations/fade';
import { HostWindowService } from '../host-window.service';
import { AppState, routerStateSelector } from '../../app.reducer';
import { hasValue, isNotUndefined } from '../empty.util';
import { getAuthenticatedUser, isAuthenticated, isAuthenticationLoading } from '../../core/auth/selectors';
import { Subscription } from 'rxjs/Subscription';
import { Eperson } from '../../core/eperson/models/eperson.model';

@Component({
  selector: 'ds-auth-nav-menu',
  templateUrl: './auth-nav-menu.component.html',
  styleUrls: ['./auth-nav-menu.component.scss'],
  animations: [fadeInOut, fadeOut]
})
export class AuthNavMenuComponent implements OnDestroy, OnInit {
  /**
   * Whether user is authenticated.
   * @type {Observable<string>}
   */
  public isAuthenticated: Observable<boolean>;

  /**
   * True if the authentication is loading.
   * @type {boolean}
   */
  public loading: Observable<boolean>;

  public showAuth = false;

  public user: Observable<Eperson>;

  protected subs: Subscription[] = [];

  constructor(private store: Store<AppState>,
              public windowService: HostWindowService) {
  }

  ngOnInit(): void {
    // set isAuthenticated
    this.isAuthenticated = this.store.select(isAuthenticated);

    // set loading
    this.loading = this.store.select(isAuthenticationLoading);

    this.user = this.store.select(getAuthenticatedUser);

    this.subs.push(this.store.select(routerStateSelector)
      .filter((router: RouterReducerState) => isNotUndefined(router) && isNotUndefined(router.state))
      .subscribe((router: RouterReducerState) => {
        this.showAuth = !router.state.url.startsWith('/login');
      }));
  }

  ngOnDestroy() {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }
}
