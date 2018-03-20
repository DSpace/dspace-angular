import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { AppState } from '../app.reducer';
import {
  AuthenticatedAction, AuthenticationSuccessAction,
  ResetAuthenticationMessagesAction
} from '../core/auth/auth.actions';
import { Subscription } from 'rxjs/Subscription';
import { hasValue, isNotEmpty } from '../shared/empty.util';
import { ActivatedRoute } from '@angular/router';
import { AuthTokenInfo } from '../core/auth/models/auth-token-info.model';
import { Observable } from 'rxjs/Observable';
import { isAuthenticated } from '../core/auth/selectors';

@Component({
  selector: 'ds-login-page',
  styleUrls: ['./login-page.component.scss'],
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent implements OnDestroy, OnInit {
  sub: Subscription;

  constructor(private route: ActivatedRoute,
              private store: Store<AppState>) {}

  ngOnInit() {
    const queryParamsObs = this.route.queryParams;
    const authenticated = this.store.select(isAuthenticated);
    this.sub = Observable.combineLatest(queryParamsObs, authenticated)
      .filter(([params, auth]) => isNotEmpty(params.token))
      .first()
      .subscribe(([params, auth]) => {
        const token = params.token;
        const authToken = new AuthTokenInfo(token);
        if (!auth) {
          this.store.dispatch(new AuthenticatedAction(authToken));
        } else {
          this.store.dispatch(new AuthenticationSuccessAction(authToken));
        }
      })
  }

  ngOnDestroy() {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
    // Clear all authentication messages when leaving login page
    this.store.dispatch(new ResetAuthenticationMessagesAction());
  }
}
