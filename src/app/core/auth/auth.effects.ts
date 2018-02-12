import { Injectable } from '@angular/core';

// import @ngrx
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

// import rxjs
import { Observable } from 'rxjs/Observable';

// import services
import { AuthService } from './auth.service';

// import actions
import {
  AuthActionTypes, AuthenticateAction, AuthenticatedAction,
  AuthenticatedErrorAction,
  AuthenticatedSuccessAction,
  AuthenticationErrorAction,
  AuthenticationSuccessAction, CheckAuthenticationTokenErrorAction,
  LogOutErrorAction,
  LogOutSuccessAction, RegistrationAction,
  RegistrationErrorAction,
  RegistrationSuccessAction
} from './auth.actions';
import { Eperson } from '../eperson/models/eperson.model';
import { AuthStatus } from './models/auth-status.model';
import { AuthTokenInfo } from './models/auth-token-info.model';
import { AppState } from '../../app.reducer';
import { isAuthenticated } from './selectors';
import { StoreActionTypes } from '../../store.actions';

@Injectable()
export class AuthEffects {

  /**
   * Authenticate user.
   * @method authenticate
   */
  @Effect()
  public authenticate: Observable<Action> = this.actions$
    .ofType(AuthActionTypes.AUTHENTICATE)
    .switchMap((action: AuthenticateAction) => {
      return this.authService.authenticate(action.payload.email, action.payload.password)
        .map((response: AuthStatus) => new AuthenticationSuccessAction(response.token))
        .catch((error) => Observable.of(new AuthenticationErrorAction(error)));
    });

  // It means "reacts to this action but don't send another"
  @Effect()
  public authenticateSuccess: Observable<Action> = this.actions$
    .ofType(AuthActionTypes.AUTHENTICATE_SUCCESS)
    .do((action: AuthenticationSuccessAction) => this.authService.storeToken(action.payload))
    .map((action: AuthenticationSuccessAction) => new AuthenticatedAction(action.payload));

  @Effect()
  public authenticated: Observable<Action> = this.actions$
    .ofType(AuthActionTypes.AUTHENTICATED)
    .switchMap((action: AuthenticatedAction) => {
      return this.authService.authenticatedUser(action.payload)
        .map((user: Eperson) => new AuthenticatedSuccessAction((user !== null), user))
        .catch((error) => Observable.of(new AuthenticatedErrorAction(error)));
    });

  @Effect({dispatch: false})
  public authenticatedError: Observable<Action> = this.actions$
    .ofType(AuthActionTypes.AUTHENTICATED_ERROR)
    .do((action: LogOutSuccessAction) => this.authService.removeToken());

  @Effect()
  public checkToken: Observable<Action> = this.actions$
    .ofType(AuthActionTypes.CHECK_AUTHENTICATION_TOKEN)
    .switchMap(() => {
      return this.authService.checkAuthenticationToken()
        .map((token: AuthTokenInfo) => new AuthenticatedAction(token))
        .catch((error) => Observable.of(new CheckAuthenticationTokenErrorAction()));
    });

  @Effect()
  public createUser: Observable<Action> = this.actions$
    .ofType(AuthActionTypes.REGISTRATION)
    .debounceTime(500) // to remove when functionality is implemented
    .switchMap((action: RegistrationAction) => {
      return this.authService.create(action.payload)
        .map((user: Eperson) => new RegistrationSuccessAction(user))
        .catch((error) => Observable.of(new RegistrationErrorAction(error)));
    });

  /**
   * When the store is rehydrated in the browser,
   * clear a possible invalid token or authentication errors
   */
  @Effect({dispatch: false})
  public clearInvalidTokenOnRehydrate = this.actions$
    .ofType(StoreActionTypes.REHYDRATE)
    .switchMap(() => {
      return this.store.select(isAuthenticated)
        .take(1)
        .filter((authenticated) => !authenticated)
        .do(() => this.authService.removeToken())
        .do(() => this.authService.resetAuthenticationError());
    });

  @Effect()
  public logOut: Observable<Action> = this.actions$
    .ofType(AuthActionTypes.LOG_OUT)
    .switchMap(() => {
      return this.authService.logout()
        .map((value) => new LogOutSuccessAction())
        .catch((error) => Observable.of(new LogOutErrorAction(error)));
    });

  @Effect({dispatch: false})
  public logOutSuccess: Observable<Action> = this.actions$
    .ofType(AuthActionTypes.LOG_OUT_SUCCESS)
    .do((action: LogOutSuccessAction) => this.authService.removeToken());

  @Effect({dispatch: false})
  public redirectToLogin: Observable<Action> = this.actions$
    .ofType(AuthActionTypes.REDIRECT)
    .do(() => this.authService.redirectToLogin());

  /**
   * @constructor
   * @param {Actions} actions$
   * @param {AuthService} authService
   * @param {Store} store
   */
  constructor(private actions$: Actions,
              private authService: AuthService,
              private store: Store<AppState>) {
  }
}
