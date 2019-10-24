import { Component, Inject, Input, OnInit, } from '@angular/core';

import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { renderAuthMethodFor } from '../authMethods-decorator';
import { AuthMethodType } from '../authMethods-type';
import { AuthMethodModel } from '../../../../core/auth/models/auth-method.model';

import { CoreState } from '../../../../core/core.reducers';
import { isAuthenticated, isAuthenticationLoading } from '../../../../core/auth/selectors';

@Component({
  selector: 'ds-log-in-shibboleth',
  templateUrl: './log-in-shibboleth.component.html',
  styleUrls: ['./log-in-shibboleth.component.scss'],

})
@renderAuthMethodFor(AuthMethodType.Shibboleth)
export class LogInShibbolethComponent implements OnInit {

  @Input() authMethodModel: AuthMethodModel;

  /**
   * True if the authentication is loading.
   * @type {boolean}
   */
  public loading: Observable<boolean>;

  /**
   * The shibboleth authentication location url.
   * @type {string}
   */
  public location: string;

  /**
   * Whether user is authenticated.
   * @type {Observable<string>}
   */
  public isAuthenticated: Observable<boolean>;

  /**
   * @constructor
   */
  constructor(
    @Inject('authMethodModelProvider') public injectedAuthMethodModel: AuthMethodModel,
    private store: Store<CoreState>
  ) {
    this.authMethodModel = injectedAuthMethodModel;
  }

  ngOnInit(): void {
    // set isAuthenticated
    this.isAuthenticated = this.store.pipe(select(isAuthenticated));

    // set loading
    this.loading = this.store.pipe(select(isAuthenticationLoading));

    // set location
    this.location = this.injectedAuthMethodModel.location
  }

}
