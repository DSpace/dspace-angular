import { TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  convertToParamMap,
  Params,
  Router,
} from '@angular/router';
import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { EpersonRegistrationService } from '../core/data/eperson-registration.service';
import { Registration } from '../core/shared/registration.model';
import { RouterMock } from '../shared/mocks/router.mock';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { validTokenGuard } from './valid-token.guard';
import createSpyObj = jasmine.createSpyObj;

describe('validTokenGuard', () => {
  const route = new RouterMock();

  const epersonRegistrationService = createSpyObj('epersonRegistrationService', {
    searchRegistrationByToken: jasmine.createSpy('searchRegistrationByToken'),
  });

  beforeEach(() => {
    const paramObject: Params = {};
    paramObject.registrationToken = '1234';
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
  });

  it('should be created', () => {
    expect(validTokenGuard).toBeTruthy();
  });

  describe('based on the response of "searchByToken"', () => {

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

      const obs = TestBed.runInInjectionContext(() => {
        return validTokenGuard({ params: { registrationToken: '123456789' } } as any, {} as any);
      }) as Observable<boolean>;
      obs.subscribe((res) => {
        expect(res).toBe(true);
      });
    });

    it('can activate must return false when registration data does not include groups', () => {
      const registrationWithoutGroups = Object.assign(new Registration(),
        {
          email: 'alba@email.org',
          token: 'test-token',
          groups: [],
          groupNames: [],
        });
      const registrationWithoutGroupsRD$ = createSuccessfulRemoteDataObject$(registrationWithoutGroups);
      epersonRegistrationService.searchRegistrationByToken.and.returnValue(registrationWithoutGroupsRD$);

      const obs = TestBed.runInInjectionContext(() => {
        return validTokenGuard({ params: { registrationToken: '123456789' } } as any, {} as any);
      }) as Observable<boolean>;
      obs.subscribe((res) => {
        expect(res).toBe(false);
      });
    });

  });
});
