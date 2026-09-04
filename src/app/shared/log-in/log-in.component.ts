import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { AuthService } from '@dspace/core/auth/auth.service';
import { AuthMethod } from '@dspace/core/auth/models/auth.method';
import { AuthMethodType } from '@dspace/core/auth/models/auth.method-type';
import {
  getAuthenticationError,
  isAuthenticated,
  isAuthenticationLoading,
  isMfaRequired,
} from '@dspace/core/auth/selectors';
import { CoreState } from '@dspace/core/core-state.model';
import { hasValue } from '@dspace/shared/utils/empty.util';
import {
  select,
  Store,
} from '@ngrx/store';
import { Observable } from 'rxjs';

import { ThemedLoadingComponent } from '../loading/themed-loading.component';
import { LogInContainerComponent } from './container/log-in-container.component';
import { LogInMfaComponent } from './methods/mfa/log-in-mfa.component';
import { AuthMethodsService } from './services/auth-methods.service';

@Component({
  selector: 'ds-base-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    LogInContainerComponent,
    LogInMfaComponent,
    ThemedLoadingComponent,
  ],
})
export class LogInComponent implements OnInit {

  /**
   * A boolean representing if LogInComponent is in a standalone page
   * @type {boolean}
   */
  @Input() isStandalonePage: boolean;

  /**
   * Method to exclude from the list of authentication methods
   */
  @Input() excludedAuthMethod: AuthMethodType;
  /**
   *  Weather or not to show the register link
   */
  @Input() showRegisterLink = true;

  /**
   * The list of authentication methods available
   * @type {AuthMethod[]}
   */
  public authMethods: Observable<AuthMethod[]>;

  /**
   * Whether user is authenticated.
   * @type {Observable<string>}
   */
  public isAuthenticated: Observable<boolean>;

  /**
   * Whether MFA verification is required.
   */
  public mfaRequired: Observable<boolean>;

  /**
   * True if the authentication is loading.
   * @type {boolean}
   */
  public loading: Observable<boolean>;

  constructor(private store: Store<CoreState>,
              private authService: AuthService,
              private authMethodsService: AuthMethodsService,
  ) {
  }

  ngOnInit(): void {
    this.authMethods = this.authMethodsService.getAuthMethods(this.excludedAuthMethod);

    // set loading
    this.loading = this.store.pipe(select(isAuthenticationLoading));

    // set isAuthenticated
    this.isAuthenticated = this.store.pipe(select(isAuthenticated));

    // set mfaRequired
    this.mfaRequired = this.store.pipe(select(isMfaRequired));

    // Clear the redirect URL if an authentication error occurs and this is not a standalone page
    this.store.pipe(select(getAuthenticationError)).subscribe((error) => {
      if (hasValue(error) && !this.isStandalonePage) {
        this.authService.clearRedirectUrl();
      }
    });
  }

}
