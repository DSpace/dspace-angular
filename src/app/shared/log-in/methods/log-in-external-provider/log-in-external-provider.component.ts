import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  select,
  Store,
} from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthService } from '../../../../core/auth/auth.service';
import { AuthMethod } from '../../../../core/auth/models/auth.method';
import {
  isAuthenticated,
  isAuthenticationLoading,
} from '../../../../core/auth/selectors';
import { CoreState } from '../../../../core/core-state.model';
import { HardRedirectService } from '../../../../core/services/hard-redirect.service';
import {
  NativeWindowRef,
  NativeWindowService,
} from '../../../../core/services/window.service';
import { isEmpty } from '../../../empty.util';

@Component({
  selector: 'ds-log-in-external-provider',
  templateUrl: './log-in-external-provider.component.html',
  styleUrls: ['./log-in-external-provider.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
  ],
})
export class LogInExternalProviderComponent implements OnInit {

  /**
   * The authentication method data.
   * @type {AuthMethod}
   */
  public authMethod: AuthMethod;

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
   * @param {AuthMethod} injectedAuthMethodModel
   * @param {boolean} isStandalonePage
   * @param {NativeWindowRef} _window
   * @param {AuthService} authService
   * @param {HardRedirectService} hardRedirectService
   * @param {Store<State>} store
   */
  constructor(
    @Inject('authMethodProvider') public injectedAuthMethodModel: AuthMethod,
    @Inject('isStandalonePage') public isStandalonePage: boolean,
    @Inject(NativeWindowService) protected _window: NativeWindowRef,
    private authService: AuthService,
    private hardRedirectService: HardRedirectService,
    private store: Store<CoreState>,
  ) {
    this.authMethod = injectedAuthMethodModel;
  }

  ngOnInit(): void {
    // set isAuthenticated
    this.isAuthenticated = this.store.pipe(select(isAuthenticated));

    // set loading
    this.loading = this.store.pipe(select(isAuthenticationLoading));

    // set location
    this.location = decodeURIComponent(this.injectedAuthMethodModel.location);

  }

  /**
   * Redirect to the external provider url for login
   */
  redirectToExternalProvider() {
    this.authService.getRedirectUrl().pipe(take(1)).subscribe((redirectRoute) => {
      if (!this.isStandalonePage) {
        redirectRoute = this.hardRedirectService.getCurrentRoute();
      } else if (isEmpty(redirectRoute)) {
        redirectRoute = '/';
      }
      const externalServerUrl = this.authService.getExternalServerRedirectUrl(
        this._window.nativeWindow.origin,
        redirectRoute,
        this.location,
      );
      // redirect to shibboleth/orcid/(external) authentication url
      this.hardRedirectService.redirect(externalServerUrl);
    });
  }

  getButtonLabel() {
    return `login.form.${this.authMethod.authMethodType}`;
  }
}
