import { Component, Injector, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthMethodModel } from '../../core/auth/models/auth-method.model';
import { select, Store } from '@ngrx/store';
import { getAuthenticationMethods, isAuthenticated, isAuthenticationLoading } from '../../core/auth/selectors';
import { CoreState } from '../../core/core.reducers';

@Component({
  selector: 'ds-auth-methods',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {
  /**
   * The authentication methods data
   * @type {AuthMethodModel[]}
   */
  @Input() authMethodData: Observable<AuthMethodModel[]>;

  @Input() isStandalonePage: boolean;

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

  constructor( private store: Store<CoreState>) {
  }

  ngOnInit(): void {
    this.authMethodData = this.store.pipe(select(getAuthenticationMethods));

    // set loading
    this.loading = this.store.pipe(select(isAuthenticationLoading));

    // set isAuthenticated
    this.isAuthenticated = this.store.pipe(select(isAuthenticated));
  }

}
