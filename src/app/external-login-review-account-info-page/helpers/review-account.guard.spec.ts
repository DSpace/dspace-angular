import { TestBed } from '@angular/core/testing';
import { ReviewAccountGuard } from './review-account.guard';
import { ActivatedRoute, convertToParamMap, Params, Router } from '@angular/router';
import { of as observableOf, of } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { EpersonRegistrationService } from '../../core/data/eperson-registration.service';
import { RouterMock } from '../../shared/mocks/router.mock';
import { createFailedRemoteDataObject$, createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { Registration } from '../../core/shared/registration.model';
import { AuthRegistrationType } from '../../core/auth/models/auth.registration-type';

describe('ReviewAccountGuard', () => {
  let guard: ReviewAccountGuard;
  let epersonRegistrationService: any;
  let authService: any;

  const route = new RouterMock();
  const registrationMock = Object.assign(new Registration(),
    {
      email: 'test@email.org',
      registrationType: AuthRegistrationType.Validation

    });

  beforeEach(() => {
    const paramObject: Params = {};
    paramObject.token = '1234';
    epersonRegistrationService = jasmine.createSpyObj('epersonRegistrationService', {
      searchRegistrationByToken: createSuccessfulRemoteDataObject$(registrationMock)
    });
    authService = {
      isAuthenticated: () => observableOf(true)
    } as any;
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: route },
      {
        provide: ActivatedRoute,
        useValue: {
          queryParamMap: observableOf(convertToParamMap(paramObject))
        },
      },
      { provide: EpersonRegistrationService, useValue: epersonRegistrationService },
      { provide: AuthService, useValue: authService }
      ]
    });
    guard = TestBed.inject(ReviewAccountGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('can activate must return true when registration type is validation', () => {
    (guard.canActivate({ params: { token: 'valid token' } } as any, {} as any) as any)
      .subscribe(
        (canActivate) => {
          expect(canActivate).toEqual(true);
        }
      );
  });

  it('should navigate to 404 if the registration search fails', () => {
    epersonRegistrationService.searchRegistrationByToken.and.returnValue(createFailedRemoteDataObject$());
    (guard.canActivate({ params: { token: 'invalid-token' } } as any, {} as any) as any).subscribe((result) => {
      expect(result).toBeFalse();
      expect(route.navigate).toHaveBeenCalledWith(['/404']);
    });
  });

  it('should navigate to 404 if the registration type is not validation and the user is not authenticated', () => {
    registrationMock.registrationType = AuthRegistrationType.Orcid;
    epersonRegistrationService.searchRegistrationByToken.and.returnValue(createSuccessfulRemoteDataObject$(registrationMock));
    spyOn(authService, 'isAuthenticated').and.returnValue(of(false));
    (guard.canActivate({ params: { token: 'invalid-token' } } as any, {} as any) as any).subscribe((result) => {
      expect(route.navigate).toHaveBeenCalledWith(['/404']);
    });
  });
});
