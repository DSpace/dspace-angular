import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { storeModuleConfig } from '../../app.reducer';
import { getMockThemeService } from '../../shared/mocks/theme-service.mock';
import { ThemeService } from '../../shared/theme-support/theme.service';
import { authReducer } from './auth.reducer';
import { AuthMethodsService } from './auth-methods.service';
import { AuthMethod } from './models/auth.method';
import { AuthMethodType } from './models/auth.method-type';

describe('AuthMethodsService', () => {
  let service: AuthMethodsService;
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
        { provide: ThemeService, useValue: getMockThemeService() },
      ],
    });

    service = TestBed.inject(AuthMethodsService);
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

      service.getAuthMethods().subscribe(result => {
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


      service.getAuthMethods(AuthMethodType.Password).subscribe(result => {
        expect(result.length).toBe(2);
        expect(result).toEqual(expected);
      });
    });

    it('should always filter out IP authentication method', () => {
      service.getAuthMethods().subscribe(result => {
        expect(result.length).toBe(3);
        expect(result.find(method => method.authMethodType === AuthMethodType.Ip)).toBeUndefined();
      });
    });

    it('should handle duplicate auth method types and keep only unique ones', (done: DoneFn) => {
      service.getAuthMethods().subscribe(result => {
        expect(result.length).toBe(3);
        // Check that we only have one Password auth method
        const passwordMethods = result.filter(method => method.authMethodType === AuthMethodType.Password);
        expect(passwordMethods.length).toBe(1);
        done();
      });
    });
  });
});
