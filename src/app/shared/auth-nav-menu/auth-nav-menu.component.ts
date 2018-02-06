
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RouterReducerState } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { fadeInOut, fadeOut } from '../animations/fade';
import { CoreState } from '../../core/core.reducers';
import { HostWindowService } from '../host-window.service';
import { AppState } from '../../app.reducer';
import { hasValue, isNotUndefined } from '../empty.util';
import { getAuthenticatedUser, isAuthenticated } from '../../core/auth/selectors';
import { Subscription } from 'rxjs/Subscription';
import { Eperson } from '../../core/eperson/models/eperson.model';

const routerStateSelector = (state: AppState) => state.router;

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

  public showAuth = false;

  public user: Observable<Eperson>;

  protected subs: Subscription[] = [];

  constructor(
    private appStore: Store<AppState>,
    private coreStore: Store<CoreState>,
    private windowService: HostWindowService) {
  }

  ngOnInit(): void {
    // set loading
    this.isAuthenticated = this.coreStore.select(isAuthenticated);

    this.user = this.appStore.select(getAuthenticatedUser);

    this.subs.push(this.appStore.select(routerStateSelector)
      .filter((router: RouterReducerState) => isNotUndefined(router))
      .subscribe((router: RouterReducerState) => {
        this.showAuth = router.state.url !== '/login';
      }));
  }

  ngOnDestroy() {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }
}
