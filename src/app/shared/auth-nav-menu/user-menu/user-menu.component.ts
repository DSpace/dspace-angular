import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { EPerson } from '../../../core/eperson/models/eperson.model';
import { AppState } from '../../../app.reducer';
import { getAuthenticatedUser, isAuthenticationLoading } from '../../../core/auth/selectors';

@Component({
  selector: 'ds-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

  /**
   * True if the authentication is loading.
   * @type {Observable<boolean>}
   */
  public loading$: Observable<boolean>;

  /**
   * The authenticated user.
   * @type {Observable<EPerson>}
   */
  public user$: Observable<EPerson>;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit(): void {

    // set loading
    this.loading$ = this.store.pipe(select(isAuthenticationLoading));

    // set user
    this.user$ = this.store.pipe(select(getAuthenticatedUser));

  }
}
