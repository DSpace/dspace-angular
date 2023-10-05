import { TestBed } from '@angular/core/testing';

import { RegistrationDataResolver } from './registration-data.resolver';
import { EpersonRegistrationService } from 'src/app/core/data/eperson-registration.service';
import { Registration } from 'src/app/core/shared/registration.model';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RegistrationData } from '../models/registration-data.model';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';

describe('RegistrationDataResolver', () => {
  let resolver: RegistrationDataResolver;
  let epersonRegistrationServiceSpy: jasmine.SpyObj<EpersonRegistrationService>;
  const registrationMock = Object.assign(new Registration(), {
     email: 'test@user.com',
  });

  beforeEach(() => {
    const spy = jasmine.createSpyObj('EpersonRegistrationService', ['searchByTokenAndUpdateData']);

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
    epersonRegistrationServiceSpy.searchByTokenAndUpdateData.and.returnValue(registrationRD$);

    const route = new ActivatedRouteSnapshot();
    route.params = { token: token };
    const state = {} as RouterStateSnapshot;

    resolver.resolve(route, state).subscribe((result: RegistrationData) => {
      expect(result).toBeDefined();
    });
  });
});
