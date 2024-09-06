import { TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  convertToParamMap,
  Params,
  Router,
} from '@angular/router';
import { cold } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
import { AuthRegistrationType } from 'src/app/core/auth/models/auth.registration-type';

import { EpersonRegistrationService } from '../../core/data/eperson-registration.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { Registration } from '../../core/shared/registration.model';
import { RouterMock } from '../../shared/mocks/router.mock';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { registrationTokenGuard } from './registration-token.guard';

describe('registrationTokenGuard', () => {
  const route = new RouterMock();
  const registrationWithGroups = Object.assign(new Registration(), {
    email: 'test@email.org',
    token: 'test-token',
    registrationType: AuthRegistrationType.Orcid,
  });
  const epersonRegistrationService = jasmine.createSpyObj('epersonRegistrationService', {
    searchRegistrationByToken: createSuccessfulRemoteDataObject$(registrationWithGroups),
  });
  const ePerson = Object.assign(new EPerson(), {
    id: 'test-eperson',
    uuid: 'test-eperson',
  });

  beforeEach(() => {
    const paramObject: Params = {};
    paramObject.token = '1234';
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: route },
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
    expect(registrationTokenGuard).toBeTruthy();
  });

  describe('based on the response of "searchByToken"', () => {
    it('can activate must return true when registration data includes groups', () => {
      TestBed.runInInjectionContext(() => {
        const result = registrationTokenGuard({ params: { token: '123456789' } } as any, {} as any);
        const expected = cold('(a|)', {
          a: true,
        });
        expect(result).toBeObservable(expected);
      });
    });

    it('can activate must return false when there is no token', () => {
      TestBed.runInInjectionContext(() => {
        const result = registrationTokenGuard({ params: { token: undefined } } as any, {} as any);
        const expected = cold('(a|)', {
          a: false,
        });
        expect(result).toBeObservable(expected);
      });
    });
  });
});
