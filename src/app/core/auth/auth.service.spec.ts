import { async, inject, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import 'rxjs/add/observable/of';

import { authReducer, AuthState } from './auth.reducer';
import { NativeWindowRef, NativeWindowService } from '../../shared/services/window.service';
import { AuthService } from './auth.service';
import { RouterStub } from '../../shared/testing/router-stub';
import { ActivatedRouteStub } from '../../shared/testing/active-router-stub';

import { CookieService } from '../../shared/services/cookie.service';
import { AuthRequestServiceStub } from '../../shared/testing/auth-request-service-stub';
import { AuthRequestService } from './auth-request.service';
import { AuthStatus } from './models/auth-status.model';
import { AuthTokenInfo } from './models/auth-token-info.model';
import { Eperson } from '../eperson/models/eperson.model';
import { EpersonMock } from '../../shared/testing/eperson-mock';
import { AppState } from '../../app.reducer';
import { ClientCookieService } from '../../shared/services/client-cookie.service';

describe('AuthService test', () => {

  const mockStore: Store<AuthState> = jasmine.createSpyObj('store', {
    dispatch: {},
    select: Observable.of(true)
  });
  let authService: AuthService;
  const authRequest = new AuthRequestServiceStub();
  const window = new NativeWindowRef();
  const routerStub = new RouterStub();
  const routeStub = new ActivatedRouteStub();
  let storage: CookieService;
  const token: AuthTokenInfo = new AuthTokenInfo('test_token');
  token.expires = Date.now() + (1000 * 60 * 60);
  let authenticatedState = {
    authenticated: true,
    loaded: true,
    loading: false,
    authToken: token,
    user: EpersonMock
  };

  describe('', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          StoreModule.forRoot({authReducer}),
        ],
        declarations: [],
        providers: [
          {provide: AuthRequestService, useValue: authRequest},
          {provide: NativeWindowService, useValue: window},
          {provide: REQUEST, useValue: {}},
          {provide: Router, useValue: routerStub},
          {provide: ActivatedRoute, useValue: routeStub},
          {provide: Store, useValue: mockStore},
          CookieService,
          AuthService
        ],
      });
      authService = TestBed.get(AuthService);
    });

    it('should return the authentication status object when user credentials are correct', () => {
      authService.authenticate('user', 'password').subscribe((status: AuthStatus) => {
        expect(status).toBeDefined();
      });
    });

    it('should throw an error when user credentials are wrong', () => {
      expect(authService.authenticate.bind(null, 'user', 'passwordwrong')).toThrow();
    });

    it('should return the authenticated user object when user token is valid', () => {
      authService.authenticatedUser(new AuthTokenInfo('test_token')).subscribe((user: Eperson) => {
        expect(user).toBeDefined();
      });
    });

    it('should throw an error when user credentials when user token is not valid', () => {
      expect(authService.authenticatedUser.bind(null, new AuthTokenInfo('test_token_expired'))).toThrow();
    });

    it('should return a valid refreshed token', () => {
      authService.refreshAuthenticationToken(new AuthTokenInfo('test_token')).subscribe((tokenState: AuthTokenInfo) => {
        expect(tokenState).toBeDefined();
      });
    });

    it('should throw an error when is not possible to refresh token', () => {
      expect(authService.refreshAuthenticationToken.bind(null, new AuthTokenInfo('test_token_expired'))).toThrow();
    });

    it('should return true when logout succeeded', () => {
      authService.logout().subscribe((status: boolean) => {
        expect(status).toBe(true);
      });
    });

    it('should throw an error when logout is not succeeded', () => {
      expect(authService.logout.bind(null)).toThrow();
    });

  });

  describe('', () => {

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({authReducer})
        ],
        providers: [
          {provide: AuthRequestService, useValue: authRequest},
          {provide: REQUEST, useValue: {}},
          {provide: Router, useValue: routerStub},
          CookieService
        ]
      }).compileComponents();
    }));

    beforeEach(inject([CookieService, AuthRequestService, Store, Router], (cookieService: CookieService, authReqService: AuthRequestService, store: Store<AppState>, router: Router) => {
      store
        .subscribe((state) => {
          (state as any).core = Object.create({});
          (state as any).core.auth = authenticatedState;
        });
      authService = new AuthService({}, window, authReqService, router, cookieService, store);
    }));

    it('should return true when user is logged in', () => {
      authService.isAuthenticated().subscribe((status: boolean) => {
        expect(status).toBe(true);
      });
    });

    it('should return token object when it is valid', () => {
      authService.hasValidAuthenticationToken().subscribe((tokenState: AuthTokenInfo) => {
        expect(tokenState).toBe(token);
      });
    });

    it('should return a token object', () => {
      const result = authService.getToken();
      expect(result).toBe(token);
    });

    it('should return false when token is not expired', () => {
      const result = authService.isTokenExpired();
      expect(result).toBe(false);
    });

  });

  describe('', () => {

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({authReducer})
        ],
        providers: [
          {provide: AuthRequestService, useValue: authRequest},
          {provide: REQUEST, useValue: {}},
          {provide: Router, useValue: routerStub},
          ClientCookieService,
          CookieService
        ]
      }).compileComponents();
    }));

    beforeEach(inject([ClientCookieService, AuthRequestService, Store, Router], (cookieService: ClientCookieService, authReqService: AuthRequestService, store: Store<AppState>, router: Router) => {
      const expiredToken: AuthTokenInfo = new AuthTokenInfo('test_token');
      expiredToken.expires = Date.now() - (1000 * 60 * 60);
      authenticatedState = {
        authenticated: true,
        loaded: true,
        loading: false,
        authToken: expiredToken,
        user: EpersonMock
      };
      store
        .subscribe((state) => {
          (state as any).core = Object.create({});
          (state as any).core.auth = authenticatedState;
        });
      authService = new AuthService({}, window, authReqService, router, cookieService, store);
      storage = (authService as any).storage;
      spyOn(storage, 'get');
      spyOn(storage, 'remove');
      spyOn(storage, 'set');
    }));

    it('should throw false when token is not valid', () => {
      expect(authService.hasValidAuthenticationToken.bind(null)).toThrow();
    });

    it('should return true when token is expired', () => {
      const result = authService.isTokenExpired();
      expect(result).toBe(true);
    });

    it('should save token into storage', () => {
      authService.storeToken(token);
      expect(storage.set).toHaveBeenCalled();
    });

    it('should remove token from storage', () => {
      authService.removeToken();
      expect(storage.remove).toHaveBeenCalled();
    });

  });
});
