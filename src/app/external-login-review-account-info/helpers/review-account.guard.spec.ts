import { TestBed } from '@angular/core/testing';
import { ReviewAccountGuard } from './review-account.guard';
import { ActivatedRoute, convertToParamMap, Params, Router } from '@angular/router';
import { of as observableOf } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { EpersonRegistrationService } from 'src/app/core/data/eperson-registration.service';
import { EPerson } from 'src/app/core/eperson/models/eperson.model';
import { Registration } from 'src/app/core/shared/registration.model';
import { RouterMock } from 'src/app/shared/mocks/router.mock';
import { createSuccessfulRemoteDataObject$ } from 'src/app/shared/remote-data.utils';

describe('ReviewAccountGuard', () => {
  let guard: ReviewAccountGuard;
  const route = new RouterMock();
  const registrationWithGroups = Object.assign(new Registration(),
    {
      email: 'test@email.org',
      token: 'test-token',
    });
  const epersonRegistrationService = jasmine.createSpyObj('epersonRegistrationService', {
    searchRegistrationByToken: createSuccessfulRemoteDataObject$(registrationWithGroups)
  });
  const authService = {
    getAuthenticatedUserFromStore: () => observableOf(ePerson),
    setRedirectUrl: () => {
      return true;
    }
  } as any;
  const ePerson = Object.assign(new EPerson(), {
    id: 'test-eperson',
    uuid: 'test-eperson'
  });
  beforeEach(() => {
    const paramObject: Params = {};
    paramObject.token = '1234';
    TestBed.configureTestingModule({
      providers: [{provide: Router, useValue: route},
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: observableOf(convertToParamMap(paramObject))
          },
        },
        {provide: EpersonRegistrationService, useValue: epersonRegistrationService},
        {provide: AuthService, useValue: authService}
      ]
    });
    guard = TestBed.get(ReviewAccountGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
  describe('based on the response of "searchByToken have', () => {
    it('can activate must return true when registration data includes groups', () => {
      (guard.canActivate({ params: { token: '123456789' } } as any, {} as any) as any)
        .subscribe(
          (canActivate) => {
            expect(canActivate).toEqual(true);
          }
        );
    });
    it('can activate must return false when registration data includes groups', () => {
      const registrationWithDifferentUsedFromLoggedInt = Object.assign(new Registration(),
        {
          email: 't1@email.org',
          token: 'test-token',
        });
      epersonRegistrationService.searchRegistrationByToken.and.returnValue(observableOf(registrationWithDifferentUsedFromLoggedInt));
      (guard.canActivate({ params: { token: '123456789' } } as any, {} as any) as any)
        .subscribe(
          (canActivate) => {
            expect(canActivate).toEqual(false);
          }
        );
    });

  });
});
