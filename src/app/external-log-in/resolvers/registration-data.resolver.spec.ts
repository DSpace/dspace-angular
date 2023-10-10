import { TestBed } from '@angular/core/testing';

import { RegistrationDataResolver } from './registration-data.resolver';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { EpersonRegistrationService } from '../../core/data/eperson-registration.service';
import { Registration } from '../../core/shared/registration.model';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';

describe('RegistrationDataResolver', () => {
  let resolver: RegistrationDataResolver;
  let epersonRegistrationServiceSpy: jasmine.SpyObj<EpersonRegistrationService>;
  const registrationMock = Object.assign(new Registration(), {
     email: 'test@user.com',
  });

  beforeEach(() => {
    const spy = jasmine.createSpyObj('EpersonRegistrationService', ['searchRegistrationByToken']);

    TestBed.configureTestingModule({
      providers: [
        RegistrationDataResolver,
        { provide: EpersonRegistrationService, useValue: spy }
      ]
    });
    resolver = TestBed.inject(RegistrationDataResolver);
    epersonRegistrationServiceSpy = TestBed.inject(EpersonRegistrationService) as jasmine.SpyObj<EpersonRegistrationService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve registration data based on a token', () => {
    const token = 'abc123';
    const registrationRD$ = createSuccessfulRemoteDataObject$(registrationMock);
    epersonRegistrationServiceSpy.searchRegistrationByToken.and.returnValue(registrationRD$);
    const route = new ActivatedRouteSnapshot();
    route.params = { token: token };
    const state = {} as RouterStateSnapshot;

    resolver.resolve(route, state).subscribe((data) => {
      expect(data).toEqual(createSuccessfulRemoteDataObject(registrationMock));
    });
    expect(epersonRegistrationServiceSpy.searchRegistrationByToken).toHaveBeenCalledWith(token);
  });
});
