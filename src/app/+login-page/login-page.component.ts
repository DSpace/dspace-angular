import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { AppState } from '../app.reducer';
import { AuthenticatedAction, ResetAuthenticationMessagesAction } from '../core/auth/auth.actions';
import { Subscription } from 'rxjs/Subscription';
import { hasValue, isNotEmpty } from '../shared/empty.util';
import { ActivatedRoute } from '@angular/router';
import { AuthTokenInfo } from '../core/auth/models/auth-token-info.model';

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
    this.sub = this.route
      .queryParams
      .subscribe((params) => {
        const token = params.token;
        console.log(token);
        if (isNotEmpty(token)) {
          const authToken = new AuthTokenInfo(token);
          this.store.dispatch(new AuthenticatedAction(authToken));
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
