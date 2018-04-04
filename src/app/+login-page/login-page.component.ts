import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { AppState } from '../app.reducer';
import {
  AddAuthenticationMessageAction, AuthenticatedAction,
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
    const authenticated = this.store.select(isAuthenticated)
    this.sub = Observable.combineLatest(queryParamsObs, authenticated)
      .filter(([params, auth]) => !auth && (isNotEmpty(params.token) || isNotEmpty(params.expired)))
      .first()
      .subscribe(([params, auth]) => {
        const token = params.token;
        if (isNotEmpty(params.token)) {
          const authToken = new AuthTokenInfo(token);
          this.store.dispatch(new AuthenticatedAction(authToken));
        } else if (isNotEmpty(params.expired)) {
          this.store.dispatch(new AddAuthenticationMessageAction('Your session has expired. Please log in again.'));
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
