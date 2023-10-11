import { TestBed } from '@angular/core/testing';
import { ValidTokenGuard } from './valid-token.guard';
import { ActivatedRoute, convertToParamMap, Params, Router } from '@angular/router';
import { of as observableOf } from 'rxjs';
import { EpersonRegistrationService } from '../core/data/eperson-registration.service';
import { AuthService } from '../core/auth/auth.service';
import { RouterMock } from '../shared/mocks/router.mock';
import { Registration } from '../core/shared/registration.model';
import { EPerson } from '../core/eperson/models/eperson.model';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';

describe('DirectAccessGuard', () => {
  let guard: ValidTokenGuard;
  const route = new RouterMock();
  const registrationWithGroups = Object.assign(new Registration(),
    {
      email: 'test@email.org',
      token: 'test-token',
      groups: ['group1UUID', 'group2UUID'],
      groupNames: ['group1', 'group2']
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
    guard = TestBed.get(ValidTokenGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
  describe('based on the response of "searchByToken have', () => {
    it('can activate must return true when registration data includes groups', () => {
      (guard.canActivate({ params: { registrationToken: '123456789' } } as any, {} as any) as any)
        .subscribe(
          (canActivate) => {
            expect(canActivate).toEqual(true);
          }
        );
    });
    it('can activate must return false when registration data includes groups', () => {
      const registrationWithDifferentUsedFromLoggedInt = Object.assign(new Registration(),
        {
          email: 'alba@email.org',
          token: 'test-token',
          groups: [],
          groupNames: []
        });
      epersonRegistrationService.searchRegistrationByToken.and.returnValue(observableOf(registrationWithDifferentUsedFromLoggedInt));
      (guard.canActivate({ params: { registrationToken: '123456789' } } as any, {} as any) as any)
        .subscribe(
          (canActivate) => {
            expect(canActivate).toEqual(false);
          }
        );
    });

  });
});
