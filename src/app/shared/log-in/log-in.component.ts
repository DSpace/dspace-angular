import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AuthMethod } from '../../core/auth/models/auth.method';
import {
  getAuthenticationError,
  getAuthenticationMethods,
  isAuthenticated,
  isAuthenticationLoading
} from '../../core/auth/selectors';
import { hasValue } from '../empty.util';
import { AuthService } from '../../core/auth/auth.service';
import { CoreState } from '../../core/core-state.model';
import { AuthMethodType } from '../../core/auth/models/auth.method-type';

/**
 * /users/sign-in
 * @class LogInComponent
 */
@Component({
  selector: 'ds-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogInComponent implements OnInit {

  /**
   * A boolean representing if LogInComponent is in a standalone page
   * @type {boolean}
   */
  @Input() isStandalonePage: boolean;

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
   * True if the authentication is loading.
   * @type {boolean}
   */
  public loading: Observable<boolean>;

  constructor(private store: Store<CoreState>,
              private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.authMethods = this.store.pipe(
      select(getAuthenticationMethods),
      // ignore the ip authentication method when it's returned by the backend
      map((methods: AuthMethod[]) => methods.filter((authMethod: AuthMethod) => authMethod.authMethodType !== AuthMethodType.Ip)),
    );

    // set loading
    this.loading = this.store.pipe(select(isAuthenticationLoading));

    // set isAuthenticated
    this.isAuthenticated = this.store.pipe(select(isAuthenticated));

    // Clear the redirect URL if an authentication error occurs and this is not a standalone page
    this.store.pipe(select(getAuthenticationError)).subscribe((error) => {
      if (hasValue(error) && !this.isStandalonePage) {
        this.authService.clearRedirectUrl();
      }
    });
  }

  /**
   * Returns an ordered list of {@link AuthMethod}s based on their position.
   *
   * @param authMethods The {@link AuthMethod}s to sort
   */
  getOrderedAuthMethods(authMethods: AuthMethod[] | null): AuthMethod[] {
    if (hasValue(authMethods)) {
      return [...authMethods].sort((method1: AuthMethod, method2: AuthMethod) => method1.position - method2.position);
    } else {
      return [];
    }
  }
}
