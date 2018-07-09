import { Component, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';

import { AppState } from '../app.reducer';
import { ResetAuthenticationMessagesAction } from '../core/auth/auth.actions';

@Component({
  selector: 'ds-login-page',
  styleUrls: ['./login-page.component.scss'],
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent implements OnDestroy {

  constructor(private store: Store<AppState>) {}

  ngOnDestroy() {
    // Clear all authentication messages when leaving login page
    this.store.dispatch(new ResetAuthenticationMessagesAction());
  }
}
