import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { EpersonRegistrationService } from '../../core/data/eperson-registration.service';
import { RemoteData } from '../../core/data/remote-data';
import { Registration } from '../../core/shared/registration.model';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../shared/remote-data.utils';
import { registrationDataResolver } from './registration-data.resolver';

describe('registrationDataResolver', () => {
  let epersonRegistrationServiceSpy: jasmine.SpyObj<EpersonRegistrationService>;
  const registrationMock = Object.assign(new Registration(), {
    email: 'test@user.com',
  });

  beforeEach(() => {
    const spy = jasmine.createSpyObj('EpersonRegistrationService', ['searchRegistrationByToken']);

    TestBed.configureTestingModule({
      providers: [
        { provide: EpersonRegistrationService, useValue: spy },
      ],
    });
    epersonRegistrationServiceSpy = TestBed.inject(EpersonRegistrationService) as jasmine.SpyObj<EpersonRegistrationService>;
  });

  it('should resolve registration data based on a token', () => {
    const token = 'abc123';
    const registrationRD$ = createSuccessfulRemoteDataObject$(registrationMock);
    epersonRegistrationServiceSpy.searchRegistrationByToken.and.returnValue(registrationRD$);
    const route = new ActivatedRouteSnapshot();
    route.params = { token: token };
    const state = {} as RouterStateSnapshot;

    const obs = TestBed.runInInjectionContext(() => {
      return registrationDataResolver(route, state);
    }) as Observable<RemoteData<Registration>>;

    obs.subscribe((data) => {
      expect(data).toEqual(createSuccessfulRemoteDataObject(registrationMock));
    });
    expect(epersonRegistrationServiceSpy.searchRegistrationByToken).toHaveBeenCalledWith(token);
  });
});
