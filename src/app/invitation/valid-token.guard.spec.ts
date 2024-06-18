import { TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  convertToParamMap,
  Params,
  Router,
} from '@angular/router';
import { cold } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';

import { EpersonRegistrationService } from '../core/data/eperson-registration.service';
import { Registration } from '../core/shared/registration.model';
import { RouterMock } from '../shared/mocks/router.mock';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { ValidTokenGuard } from './valid-token.guard';
import createSpyObj = jasmine.createSpyObj;

describe('DirectAccessGuard', () => {
  let guard: ValidTokenGuard;
  const route = new RouterMock();

  const epersonRegistrationService = jasmine.createSpyObj('epersonRegistrationService', {
    searchRegistrationByToken: jasmine.createSpy('searchRegistrationByToken'),
  });

  beforeEach(() => {
    const paramObject: Params = {};
    paramObject.token = '1234';
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: route },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: observableOf(convertToParamMap(paramObject)),
          },
        },
        { provide: EpersonRegistrationService, useValue: epersonRegistrationService },
      ],
    });
    guard = TestBed.get(ValidTokenGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
  describe('based on the response of "searchByToken have', () => {

    it('can activate must return true when registration data includes groups', () => {
      const registrationWithGroups = Object.assign(new Registration(),
        {
          email: 'test@email.org',
          token: 'test-token',
          groups: ['group1UUID', 'group2UUID'],
          groupNames: ['group1', 'group2'],
        });
      const registrationWithGroupsRD$ = createSuccessfulRemoteDataObject$(registrationWithGroups);
      epersonRegistrationService.searchRegistrationByToken.and.returnValue(registrationWithGroupsRD$);

      const result = cold('(a|)', {
        a: true,
      });
      const canActivate = guard.canActivate({ params: { registrationToken: '123456789' } } as any, {} as any);
      expect(canActivate).toBeObservable(result);

    });

    it('can activate must return false when registration data includes groups', () => {
      const registrationWithDifferentUsedFromLoggedInt = Object.assign(new Registration(),
        {
          email: 'alba@email.org',
          token: 'test-token',
          groups: [],
          groupNames: [],
        });
      const registrationWithDifferentUsedFromLoggedIntRD$ = createSuccessfulRemoteDataObject$(registrationWithDifferentUsedFromLoggedInt);
      epersonRegistrationService.searchRegistrationByToken.and.returnValue(registrationWithDifferentUsedFromLoggedIntRD$);
      const result = cold('(a|)', {
        a: false,
      });
      const canActivate = guard.canActivate({ params: { registrationToken: '123456789' } } as any, {} as any);

      expect(canActivate).toBeObservable(result);
    });

  });
});
