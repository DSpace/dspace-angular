import { async, inject, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Store, StoreModule } from '@ngrx/store';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { of as observableOf } from 'rxjs';

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
import { EPerson } from '../eperson/models/eperson.model';
import { EPersonMock } from '../../shared/testing/eperson-mock';
import { AppState } from '../../app.reducer';
import { ClientCookieService } from '../../shared/services/client-cookie.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { getMockRemoteDataBuildService } from '../../shared/mocks/mock-remote-data-build.service';

describe('AuthService test', () => {

  let mockStore: Store<AuthState>;
  let authService: AuthService;
  let authRequest;
  let window;
  let routerStub;
  let routeStub;
  let storage: CookieService;
  let token: AuthTokenInfo;
  let authenticatedState;
  let rdbService;

  function init() {
    mockStore = jasmine.createSpyObj('store', {
      dispatch: {},
      pipe: observableOf(true)
    });
    window = new NativeWindowRef();
    routerStub = new RouterStub();
    token = new AuthTokenInfo('test_token');
    token.expires = Date.now() + (1000 * 60 * 60);
    authenticatedState = {
      authenticated: true,
      loaded: true,
      loading: false,
      authToken: token,
      user: EPersonMock
    };
    authRequest = new AuthRequestServiceStub();
    routeStub = new ActivatedRouteStub();
    rdbService = getMockRemoteDataBuildService();
    spyOn(rdbService, 'build').and.returnValue({authenticated: true, eperson: observableOf({payload: {}})});

  }

  describe('', () => {
    beforeEach(() => {
      init();
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          StoreModule.forRoot({ authReducer }),
        ],
        declarations: [],
        providers: [
          { provide: AuthRequestService, useValue: authRequest },
          { provide: NativeWindowService, useValue: window },
          { provide: REQUEST, useValue: {} },
          { provide: Router, useValue: routerStub },
          { provide: ActivatedRoute, useValue: routeStub },
          { provide: Store, useValue: mockStore },
          { provide: RemoteDataBuildService, useValue: rdbService },
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
      authService.authenticatedUser(new AuthTokenInfo('test_token')).subscribe((user: EPerson) => {
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
      init();
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({ authReducer })
        ],
        providers: [
          { provide: AuthRequestService, useValue: authRequest },
          { provide: REQUEST, useValue: {} },
          { provide: Router, useValue: routerStub },
          { provide: RemoteDataBuildService, useValue: rdbService },
          CookieService,
          AuthService
        ]
      }).compileComponents();
    }));

    beforeEach(inject([CookieService, AuthRequestService, Store, Router], (cookieService: CookieService, authReqService: AuthRequestService, store: Store<AppState>, router: Router) => {
      store
        .subscribe((state) => {
          (state as any).core = Object.create({});
          (state as any).core.auth = authenticatedState;
        });
      authService = new AuthService({}, window, undefined, authReqService, router, cookieService, store, rdbService);
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
      init();
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({ authReducer })
        ],
        providers: [
          { provide: AuthRequestService, useValue: authRequest },
          { provide: REQUEST, useValue: {} },
          { provide: Router, useValue: routerStub },
          { provide: RemoteDataBuildService, useValue: rdbService },
          ClientCookieService,
          CookieService,
          AuthService
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
        user: EPersonMock
      };
      store
        .subscribe((state) => {
          (state as any).core = Object.create({});
          (state as any).core.auth = authenticatedState;
        });
      authService = new AuthService({}, window, undefined, authReqService, router, cookieService, store, rdbService);
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
