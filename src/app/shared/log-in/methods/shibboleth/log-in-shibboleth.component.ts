import { Component, Inject, OnInit, } from '@angular/core';

import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { renderAuthMethodFor } from '../log-in.methods-decorator';
import { AuthMethodType } from '../../../../core/auth/models/auth.method-type';
import { AuthMethod } from '../../../../core/auth/models/auth.method';

import { CoreState } from '../../../../core/core.reducers';
import { isAuthenticated, isAuthenticationLoading } from '../../../../core/auth/selectors';
import { RouteService } from '../../../../core/services/route.service';
import { NativeWindowRef, NativeWindowService } from '../../../../core/services/window.service';
import { isNotNull, isEmpty } from '../../../empty.util';
import { AuthService } from '../../../../core/auth/auth.service';
import { HardRedirectService } from '../../../../core/services/hard-redirect.service';
import { take } from 'rxjs/operators';
import { URLCombiner } from '../../../../core/url-combiner/url-combiner';

@Component({
  selector: 'ds-log-in-shibboleth',
  templateUrl: './log-in-shibboleth.component.html',
  styleUrls: ['./log-in-shibboleth.component.scss'],

})
@renderAuthMethodFor(AuthMethodType.Shibboleth)
export class LogInShibbolethComponent implements OnInit {

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
   * @param {RouteService} route
   * @param {AuthService} authService
   * @param {HardRedirectService} hardRedirectService
   * @param {Store<State>} store
   */
  constructor(
    @Inject('authMethodProvider') public injectedAuthMethodModel: AuthMethod,
    @Inject('isStandalonePage') public isStandalonePage: boolean,
    @Inject(NativeWindowService) protected _window: NativeWindowRef,
    private route: RouteService,
    private authService: AuthService,
    private hardRedirectService: HardRedirectService,
    private store: Store<CoreState>
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

  redirectToShibboleth() {

    this.authService.getRedirectUrl().pipe(take(1)).subscribe((redirectRoute) => {
      if (!this.isStandalonePage) {
        redirectRoute = this.hardRedirectService.getCurrentRoute();
      } else if (isEmpty(redirectRoute)) {
        redirectRoute = '/';
      }
      const correctRedirectUrl = new URLCombiner(this._window.nativeWindow.origin, redirectRoute).toString();

      let shibbolethServerUrl = this.location;
      const myRegexp = /\?redirectUrl=(.*)/g;
      const match = myRegexp.exec(this.location);
      const redirectUrlFromServer = (match && match[1]) ? match[1] : null;

      // Check whether the current page is different from the redirect url received from rest
      if (isNotNull(redirectUrlFromServer) && redirectUrlFromServer !== correctRedirectUrl) {
        // change the redirect url with the current page url
        const newRedirectUrl = `?redirectUrl=${correctRedirectUrl}`;
        shibbolethServerUrl = this.location.replace(/\?redirectUrl=(.*)/g, newRedirectUrl);
      }

      // redirect to shibboleth authentication url
      this.hardRedirectService.redirect(shibbolethServerUrl);
    });

  }

}
