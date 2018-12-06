import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '../../app.reducer';
import { LogOutAction } from '../../core/auth/auth.actions';
import { getLogOutError, isAuthenticationLoading } from '../../core/auth/selectors';
import { fadeOut } from '../animations/fade';

@Component({
  selector: 'ds-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.scss'],
  animations: [fadeOut]
})
export class LogOutComponent implements OnDestroy, OnInit {
  /**
   * The error if authentication fails.
   * @type {Observable<string>}
   */
  public error: Observable<string>;

  /**
   * True if the logout is loading.
   * @type {boolean}
   */
  public loading: Observable<boolean>;

  /**
   * Component state.
   * @type {boolean}
   */
  private alive = true;

  /**
   * @constructor
   * @param {Store<State>} store
   */
  constructor(private router: Router,
              private store: Store<AppState>) {
  }

  /**
   *  Lifecycle hook that is called when a directive, pipe or service is destroyed.
   */
  public ngOnDestroy() {
    this.alive = false;
  }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  ngOnInit() {
    // set error
    this.error = this.store.pipe(select(getLogOutError));

    // set loading
    this.loading = this.store.pipe(select(isAuthenticationLoading));
  }

  /**
   * Go to the home page.
   */
  public home() {
    this.router.navigate(['/home']);
  }

  public logOut() {
    this.store.dispatch(new LogOutAction());
  }

}
