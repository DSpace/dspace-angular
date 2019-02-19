import { of as observableOf, Observable } from 'rxjs';

import { filter, debounceTime, switchMap, take, tap, catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

// import @ngrx
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';

// import services
import { AuthService } from './auth.service';
// import actions
import {
  AuthActionTypes,
  AuthenticateAction,
  AuthenticatedAction,
  AuthenticatedErrorAction,
  AuthenticatedSuccessAction,
  AuthenticationErrorAction,
  AuthenticationSuccessAction,
  CheckAuthenticationTokenErrorAction,
  LogOutErrorAction,
  LogOutSuccessAction,
  RefreshTokenAction,
  RefreshTokenErrorAction,
  RefreshTokenSuccessAction,
  RegistrationAction,
  RegistrationErrorAction,
  RegistrationSuccessAction
} from './auth.actions';
import { EPerson } from '../eperson/models/eperson.model';
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
  public authenticate$: Observable<Action> = this.actions$.pipe(
      ofType(AuthActionTypes.AUTHENTICATE),
      switchMap((action: AuthenticateAction) => {
        return this.authService.authenticate(action.payload.email, action.payload.password).pipe(
          take(1),
          map((response: AuthStatus) => new AuthenticationSuccessAction(response.token)),
          catchError((error) => observableOf(new AuthenticationErrorAction(error)))
        );
      })
    );

  @Effect()
  public authenticateSuccess$: Observable<Action> = this.actions$.pipe(
      ofType(AuthActionTypes.AUTHENTICATE_SUCCESS),
      tap((action: AuthenticationSuccessAction) => this.authService.storeToken(action.payload)),
      map((action: AuthenticationSuccessAction) => new AuthenticatedAction(action.payload))
    );

  @Effect()
  public authenticated$: Observable<Action> = this.actions$.pipe(
      ofType(AuthActionTypes.AUTHENTICATED),
      switchMap((action: AuthenticatedAction) => {
        return this.authService.authenticatedUser(action.payload).pipe(
          map((user: EPerson) => new AuthenticatedSuccessAction((user !== null), action.payload, user)),
          catchError((error) => observableOf(new AuthenticatedErrorAction(error))),);
      })
    );

  // It means "reacts to this action but don't send another"
  @Effect({ dispatch: false })
  public authenticatedError$: Observable<Action> = this.actions$.pipe(
      ofType(AuthActionTypes.AUTHENTICATED_ERROR),
      tap((action: LogOutSuccessAction) => this.authService.removeToken())
    );

  @Effect()
  public checkToken$: Observable<Action> = this.actions$.pipe(ofType(AuthActionTypes.CHECK_AUTHENTICATION_TOKEN),
      switchMap(() => {
        return this.authService.hasValidAuthenticationToken().pipe(
          map((token: AuthTokenInfo) => new AuthenticatedAction(token)),
          catchError((error) => observableOf(new CheckAuthenticationTokenErrorAction()))
        );
      })
    );

  @Effect()
  public createUser$: Observable<Action> = this.actions$.pipe(
      ofType(AuthActionTypes.REGISTRATION),
      debounceTime(500), // to remove when functionality is implemented
      switchMap((action: RegistrationAction) => {
        return this.authService.create(action.payload).pipe(
          map((user: EPerson) => new RegistrationSuccessAction(user)),
          catchError((error) => observableOf(new RegistrationErrorAction(error)))
        );
      })
    );

  @Effect()
  public refreshToken$: Observable<Action> = this.actions$.pipe(ofType(AuthActionTypes.REFRESH_TOKEN),
      switchMap((action: RefreshTokenAction) => {
        return this.authService.refreshAuthenticationToken(action.payload).pipe(
          map((token: AuthTokenInfo) => new RefreshTokenSuccessAction(token)),
          catchError((error) => observableOf(new RefreshTokenErrorAction()))
        );
      })
    );

  // It means "reacts to this action but don't send another"
  @Effect({ dispatch: false })
  public refreshTokenSuccess$: Observable<Action> = this.actions$.pipe(
      ofType(AuthActionTypes.REFRESH_TOKEN_SUCCESS),
      tap((action: RefreshTokenSuccessAction) => this.authService.replaceToken(action.payload))
    );

  /**
   * When the store is rehydrated in the browser,
   * clear a possible invalid token or authentication errors
   */
  @Effect({ dispatch: false })
  public clearInvalidTokenOnRehydrate$: Observable<any> = this.actions$.pipe(
    ofType(StoreActionTypes.REHYDRATE),
    switchMap(() => {
      return this.store.pipe(
        select(isAuthenticated),
        take(1),
        filter((authenticated) => !authenticated),
        tap(() => this.authService.removeToken()),
        tap(() => this.authService.resetAuthenticationError())
      );
    }));

  @Effect()
  public logOut$: Observable<Action> = this.actions$
    .pipe(
      ofType(AuthActionTypes.LOG_OUT),
      switchMap(() => {
        return this.authService.logout().pipe(
          map((value) => new LogOutSuccessAction()),
          catchError((error) => observableOf(new LogOutErrorAction(error)))
        );
      })
    );

  @Effect({ dispatch: false })
  public logOutSuccess$: Observable<Action> = this.actions$
    .pipe(ofType(AuthActionTypes.LOG_OUT_SUCCESS),
      tap(() => this.authService.removeToken()),
      tap(() => this.authService.clearRedirectUrl()),
      tap(() => this.authService.refreshAfterLogout())
    );

  @Effect({ dispatch: false })
  public redirectToLogin$: Observable<Action> = this.actions$
    .pipe(ofType(AuthActionTypes.REDIRECT_AUTHENTICATION_REQUIRED),
      tap(() => this.authService.removeToken()),
      tap(() => this.authService.redirectToLogin())
    );

  @Effect({ dispatch: false })
  public redirectToLoginTokenExpired$: Observable<Action> = this.actions$
    .pipe(
      ofType(AuthActionTypes.REDIRECT_TOKEN_EXPIRED),
      tap(() => this.authService.removeToken()),
      tap(() => this.authService.redirectToLoginWhenTokenExpired())
    );

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
