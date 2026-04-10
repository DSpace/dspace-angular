import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import {
  firstValueFrom,
  of,
} from 'rxjs';
import { PAGE_NOT_FOUND_PATH } from 'src/app/app-routing-paths';

import { HardRedirectService } from '../services/hard-redirect.service';
import { AuthService } from './auth.service';
import { notAuthenticatedGuard } from './not-authenticated.guard';

describe('notAuthenticatedGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let hardRedirectService: jasmine.SpyObj<HardRedirectService>;
  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    const redirectSpy = jasmine.createSpyObj('HardRedirectService', ['redirect']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: HardRedirectService, useValue: redirectSpy },
      ],
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    hardRedirectService = TestBed.inject(HardRedirectService) as jasmine.SpyObj<HardRedirectService>;
  });

  it('should block access and redirect if user is logged in', async () => {
    authService.isAuthenticated.and.returnValue(of(true));

    const result$ = TestBed.runInInjectionContext(() =>
      notAuthenticatedGuard(mockRoute, mockState),
    );

    const result = await firstValueFrom(result$ as any);
    expect(result).toBe(false);
    expect(hardRedirectService.redirect).toHaveBeenCalledWith(PAGE_NOT_FOUND_PATH);
  });

  it('should allow access if user is not logged in', async () => {
    authService.isAuthenticated.and.returnValue(of(false));

    const result$ = TestBed.runInInjectionContext(() =>
      notAuthenticatedGuard(mockRoute, mockState),
    );

    const result = await firstValueFrom(result$ as any);
    expect(result).toBe(true);
    expect(hardRedirectService.redirect).not.toHaveBeenCalled();
  });
});
