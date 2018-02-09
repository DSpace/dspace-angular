import { Injectable } from '@angular/core';

// import @ngrx
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

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
  AuthenticationSuccessAction, LogOutAction,
  LogOutErrorAction,
  LogOutSuccessAction, RegistrationAction,
  RegistrationErrorAction,
  RegistrationSuccessAction
} from './auth.actions';
import { Eperson } from '../eperson/models/eperson.model';
import { AuthStatus } from './models/auth-status.model';

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
    .map((action: AuthenticationSuccessAction) => new AuthenticatedAction(action.payload))

  @Effect({dispatch: false})
  public logOutSuccess: Observable<Action> = this.actions$
    .ofType(AuthActionTypes.LOG_OUT_SUCCESS)
    .do((action: LogOutSuccessAction) => this.authService.removeToken());

  @Effect()
  public authenticated: Observable<Action> = this.actions$
    .ofType(AuthActionTypes.AUTHENTICATED)
    .switchMap((action: AuthenticatedAction) => {
      return this.authService.authenticatedUser(action.payload)
        .map((user: Eperson) => new AuthenticatedSuccessAction((user !== null), user))
        .catch((error) => Observable.of(new AuthenticatedErrorAction(error)));
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

  @Effect()
  public signOut: Observable<Action> = this.actions$
    .ofType(AuthActionTypes.LOG_OUT)
    .switchMap((action: LogOutAction) => {
      return this.authService.signout()
        .map((value) => new LogOutSuccessAction())
        .catch((error) => Observable.of(new LogOutErrorAction(error)));
    });

  /**
   * @constructor
   * @param {Actions} actions$
   * @param {AuthService} authService
   */
  constructor(private actions$: Actions,
              private authService: AuthService) {
  }
}
