import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthMethodModel } from '../../core/auth/models/auth-method.model';
import { select, Store } from '@ngrx/store';
import { getAuthenticationMethods, isAuthenticated, isAuthenticationLoading } from '../../core/auth/selectors';
import { CoreState } from '../../core/core.reducers';
import { filter, takeWhile, } from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'ds-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit, OnDestroy {
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

  /**
   * Component state.
   * @type {boolean}
   */
  private alive = true;

  constructor(private store: Store<CoreState>,
              private authService: AuthService,) {
  }

  ngOnInit(): void {

    // this.store.dispatch(new SetIsStandalonePageInAuthMethodsAction(this.isStandalonePage));

    this.authMethodData = this.store.pipe(
      select(getAuthenticationMethods),
    );

    // set loading
    this.loading = this.store.pipe(select(isAuthenticationLoading));

    // set isAuthenticated
    this.isAuthenticated = this.store.pipe(select(isAuthenticated));

    // subscribe to success
    this.store.pipe(
      select(isAuthenticated),
      takeWhile(() => this.alive),
      filter((authenticated) => authenticated))
      .subscribe(() => {
          this.authService.redirectAfterLoginSuccess(this.isStandalonePage);
        }
      );

  }

  ngOnDestroy(): void {
    this.alive = false;
  }

}
