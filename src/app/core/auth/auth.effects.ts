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

/**
 * Effects offer a way to isolate and easily test side-effects within your
 * application.
 * The `toPayload` helper function returns just
 * the payload of the currently dispatched action, useful in
 * instances where the current state is not necessary.
 *
 * Documentation on `toPayload` can be found here:
 * https://github.com/ngrx/effects/blob/master/docs/api.md#topayload
 *
 * If you are unfamiliar with the operators being used in these examples, please
 * check out the sources below:
 *
 * Official Docs: http://reactivex.io/rxjs/manual/overview.html#categories-of-operators
 * RxJS 5 Operators By Example: https://gist.github.com/btroncone/d6cf141d6f2c00dc6b35
 */

@Injectable()
export class AuthEffects {

  /**
   * Authenticate user.
   * @method authenticate
   */
  @Effect()
  public authenticate: Observable<Action> = this.actions$
    .ofType(AuthActionTypes.AUTHENTICATE)
    .debounceTime(500)
    .switchMap((action: AuthenticateAction) => {
      return this.authService.authenticate(action.payload.email, action.payload.password)
        .map((user: Eperson) => new AuthenticationSuccessAction(user))
        .catch((error) => Observable.of(new AuthenticationErrorAction(error)));
    });

  @Effect()
  public authenticated: Observable<Action> = this.actions$
    .ofType(AuthActionTypes.AUTHENTICATED)
    .switchMap((action: AuthenticatedAction) => {
      return this.authService.authenticatedUser()
        .map((user: Eperson) => new AuthenticatedSuccessAction((user !== null), user))
        .catch((error) => Observable.of(new AuthenticatedErrorAction(error)));
    });

  @Effect()
  public createUser: Observable<Action> = this.actions$
    .ofType(AuthActionTypes.REGISTRATION)
    .debounceTime(500)
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
