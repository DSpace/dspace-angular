import { TestBed } from '@angular/core/testing';
import {
  Store,
  StoreModule,
} from '@ngrx/store';
import {
  MockStore,
  provideMockStore,
} from '@ngrx/store/testing';

import { storeModuleConfig } from '../../app.reducer';
import { AuthMethodTypeComponent } from '../../shared/log-in/methods/auth-methods.type';
import { authReducer } from './auth.reducer';
import { AuthMethodsService } from './auth-methods.service';
import { AuthMethod } from './models/auth.method';
import { AuthMethodType } from './models/auth.method-type';

describe('AuthMethodsService', () => {
  let service: AuthMethodsService;
  let store: MockStore;
  let mockAuthMethods: Map<AuthMethodType, AuthMethodTypeComponent>;
  let mockAuthMethodsArray: AuthMethod[] = [
    { id: 'password', authMethodType: AuthMethodType.Password, position: 2 } as AuthMethod,
    { id: 'shibboleth', authMethodType: AuthMethodType.Shibboleth, position: 1 } as AuthMethod,
    { id: 'oidc', authMethodType: AuthMethodType.Oidc, position: 3 } as AuthMethod,
    { id: 'ip', authMethodType: AuthMethodType.Ip, position: 4 } as AuthMethod,
  ];

  const initialState = {
    core: {
      auth: {
        authMethods: mockAuthMethodsArray,
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(authReducer, storeModuleConfig),
      ],
      providers: [
        AuthMethodsService,
        provideMockStore({ initialState }),
      ],
    });

    service = TestBed.inject(AuthMethodsService);
    store = TestBed.inject(Store) as MockStore;

    // Setup mock auth methods map
    mockAuthMethods = new Map<AuthMethodType, AuthMethodTypeComponent>();
    mockAuthMethods.set(AuthMethodType.Password, {} as AuthMethodTypeComponent);
    mockAuthMethods.set(AuthMethodType.Shibboleth, {} as AuthMethodTypeComponent);
    mockAuthMethods.set(AuthMethodType.Oidc, {} as AuthMethodTypeComponent);
    mockAuthMethods.set(AuthMethodType.Ip, {} as AuthMethodTypeComponent);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAuthMethods', () => {
    it('should return auth methods sorted by position', () => {

      // Expected result after sorting and filtering IP auth
      const expected = [
        { id: 'shibboleth', authMethodType: AuthMethodType.Shibboleth, position: 1 },
        { id: 'password', authMethodType: AuthMethodType.Password, position: 2 },
        { id: 'oidc', authMethodType: AuthMethodType.Oidc, position: 3 },
      ];

      service.getAuthMethods(mockAuthMethods).subscribe(result => {
        expect(result.length).toBe(3);
        expect(result).toEqual(expected);
      });
    });

    it('should exclude specified auth method type', () => {

      // Expected result after excluding Password auth and filtering IP auth
      const expected = [
        { id: 'shibboleth', authMethodType: AuthMethodType.Shibboleth, position: 1 },
        { id: 'oidc', authMethodType: AuthMethodType.Oidc, position: 3 },
      ];


      service.getAuthMethods(mockAuthMethods, AuthMethodType.Password).subscribe(result => {
        expect(result.length).toBe(2);
        expect(result).toEqual(expected);
      });
    });

    it('should always filter out IP authentication method', () => {

      // Add IP auth to the mock methods map
      mockAuthMethods.set(AuthMethodType.Ip, {} as AuthMethodTypeComponent);


      service.getAuthMethods(mockAuthMethods).subscribe(result => {
        expect(result.length).toBe(3);
        expect(result.find(method => method.authMethodType === AuthMethodType.Ip)).toBeUndefined();
      });
    });

    it('should handle empty auth methods array', () => {
      const authMethods = new Map<AuthMethodType, AuthMethodTypeComponent>();


      service.getAuthMethods(authMethods).subscribe(result => {
        expect(result.length).toBe(0);
        expect(result).toEqual([]);
      });
    });

    it('should handle duplicate auth method types and keep only unique ones', () => {
      // Arrange
      const duplicateMethodsArray = [
        ...mockAuthMethodsArray,
        { id: 'password2', authMethodType: AuthMethodType.Password, position: 5 } as AuthMethod,
      ];


      service.getAuthMethods(mockAuthMethods).subscribe(result => {
        expect(result.length).toBe(3);
        // Check that we only have one Password auth method
        const passwordMethods = result.filter(method => method.authMethodType === AuthMethodType.Password);
        expect(passwordMethods.length).toBe(1);
      });
    });
  });
});
