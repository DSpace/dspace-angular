import { TestBed } from '@angular/core/testing';

import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of'

import { AuthEffects } from './auth.effects';
import {
  AuthActionTypes,
  AuthenticatedAction,
  AuthenticatedErrorAction,
  AuthenticatedSuccessAction,
  AuthenticationErrorAction,
  AuthenticationSuccessAction,
  CheckAuthenticationTokenErrorAction,
  LogOutErrorAction,
  LogOutSuccessAction,
  RefreshTokenErrorAction,
  RefreshTokenSuccessAction
} from './auth.actions';
import { AuthServiceStub } from '../../shared/testing/auth-service-stub';
import { AuthService } from './auth.service';
import { TruncatablesState } from '../../shared/truncatable/truncatable.reducer';

import { EpersonMock } from '../../shared/testing/eperson-mock';

describe('AuthEffects', () => {
  let authEffects: AuthEffects;
  let actions: Observable<any>;

  const authServiceStub = new AuthServiceStub();
  const store: Store<TruncatablesState> = jasmine.createSpyObj('store', {
    /* tslint:disable:no-empty */
    dispatch: {},
    /* tslint:enable:no-empty */
    select: Observable.of(true)
  });
  const token = authServiceStub.getToken();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        {provide: AuthService, useValue: authServiceStub},
        {provide: Store, useValue: store},
        provideMockActions(() => actions),
        // other providers
      ],
    });

    authEffects = TestBed.get(AuthEffects);
  });

  describe('authenticate$', () => {
    describe('when credentials are correct', () => {
      it('should return a AUTHENTICATE_SUCCESS action in response to a AUTHENTICATE action', () => {
        actions = hot('--a-', {
          a: {
            type: AuthActionTypes.AUTHENTICATE,
            payload: {email: 'user', password: 'password'}
          }
        });

        const expected = cold('--b-', {b: new AuthenticationSuccessAction(token)});

        expect(authEffects.authenticate$).toBeObservable(expected);
      });
    });

    describe('when credentials are wrong', () => {
      it('should return a AUTHENTICATE_ERROR action in response to a AUTHENTICATE action', () => {
        spyOn((authEffects as any).authService, 'authenticate').and.returnValue(Observable.throw(new Error('Message Error test')));

        actions = hot('--a-', {
          a: {
            type: AuthActionTypes.AUTHENTICATE,
            payload: {email: 'user', password: 'wrongpassword'}
          }
        });

        const expected = cold('--b-', {b: new AuthenticationErrorAction(new Error('Message Error test'))});

        expect(authEffects.authenticate$).toBeObservable(expected);
      });
    });
  });

  describe('authenticateSuccess$', () => {

    it('should return a AUTHENTICATED action in response to a AUTHENTICATE_SUCCESS action', () => {
      actions = hot('--a-', {a: {type: AuthActionTypes.AUTHENTICATE_SUCCESS, payload: token}});

      const expected = cold('--b-', {b: new AuthenticatedAction(token)});

      expect(authEffects.authenticateSuccess$).toBeObservable(expected);
    });
  });

  describe('authenticated$', () => {

    describe('when token is valid', () => {
      it('should return a AUTHENTICATED_SUCCESS action in response to a AUTHENTICATED action', () => {
        actions = hot('--a-', {a: {type: AuthActionTypes.AUTHENTICATED, payload: token}});

        const expected = cold('--b-', {b: new AuthenticatedSuccessAction(true, token, EpersonMock)});

        expect(authEffects.authenticated$).toBeObservable(expected);
      });
    });

    describe('when token is not valid', () => {
      it('should return a AUTHENTICATED_ERROR action in response to a AUTHENTICATED action', () => {
        spyOn((authEffects as any).authService, 'authenticatedUser').and.returnValue(Observable.throw(new Error('Message Error test')));

        actions = hot('--a-', {a: {type: AuthActionTypes.AUTHENTICATED, payload: token}});

        const expected = cold('--b-', {b: new AuthenticatedErrorAction(new Error('Message Error test'))});

        expect(authEffects.authenticated$).toBeObservable(expected);
      });
    });
  });

  describe('checkToken$', () => {

    describe('when check token succeeded', () => {
      it('should return a AUTHENTICATED action in response to a CHECK_AUTHENTICATION_TOKEN action', () => {

        actions = hot('--a-', {a: {type: AuthActionTypes.CHECK_AUTHENTICATION_TOKEN}});

        const expected = cold('--b-', {b: new AuthenticatedAction(token)});

        expect(authEffects.checkToken$).toBeObservable(expected);
      });
    });

    describe('when check token failed', () => {
      it('should return a CHECK_AUTHENTICATION_TOKEN_ERROR action in response to a CHECK_AUTHENTICATION_TOKEN action', () => {
        spyOn((authEffects as any).authService, 'hasValidAuthenticationToken').and.returnValue(Observable.throw(''));

        actions = hot('--a-', {a: {type: AuthActionTypes.CHECK_AUTHENTICATION_TOKEN, payload: token}});

        const expected = cold('--b-', {b: new CheckAuthenticationTokenErrorAction()});

        expect(authEffects.checkToken$).toBeObservable(expected);
      });
    })
  });

  describe('refreshToken$', () => {

    describe('when refresh token succeeded', () => {
      it('should return a REFRESH_TOKEN_SUCCESS action in response to a REFRESH_TOKEN action', () => {

        actions = hot('--a-', {a: {type: AuthActionTypes.REFRESH_TOKEN}});

        const expected = cold('--b-', {b: new RefreshTokenSuccessAction(token)});

        expect(authEffects.refreshToken$).toBeObservable(expected);
      });
    });

    describe('when refresh token failed', () => {
      it('should return a REFRESH_TOKEN_ERROR action in response to a REFRESH_TOKEN action', () => {
        spyOn((authEffects as any).authService, 'refreshAuthenticationToken').and.returnValue(Observable.throw(''));

        actions = hot('--a-', {a: {type: AuthActionTypes.REFRESH_TOKEN, payload: token}});

        const expected = cold('--b-', {b: new RefreshTokenErrorAction()});

        expect(authEffects.refreshToken$).toBeObservable(expected);
      });
    })
  });

  describe('logOut$', () => {

    describe('when refresh token succeeded', () => {
      it('should return a LOG_OUT_SUCCESS action in response to a LOG_OUT action', () => {

        actions = hot('--a-', {a: {type: AuthActionTypes.LOG_OUT}});

        const expected = cold('--b-', {b: new LogOutSuccessAction()});

        expect(authEffects.logOut$).toBeObservable(expected);
      });
    });

    describe('when refresh token failed', () => {
      it('should return a REFRESH_TOKEN_ERROR action in response to a LOG_OUT action', () => {
        spyOn((authEffects as any).authService, 'logout').and.returnValue(Observable.throw(new Error('Message Error test')));

        actions = hot('--a-', {a: {type: AuthActionTypes.LOG_OUT, payload: token}});

        const expected = cold('--b-', {b: new LogOutErrorAction(new Error('Message Error test'))});

        expect(authEffects.logOut$).toBeObservable(expected);
      });
    })
  });
});
