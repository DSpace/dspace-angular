import { TestBed } from '@angular/core/testing';

import { RegistrationDataCreateUserResolver } from './registration-data-create-user.resolver';
import { createFailedRemoteDataObject$, createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { EpersonRegistrationService } from '../../core/data/eperson-registration.service';
import { RouterStateSnapshot } from '@angular/router';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { RegistrationData } from '../../shared/external-log-in-complete/models/registration-data.model';
import { Registration } from '../../core/shared/registration.model';
import { MetadataValue } from 'src/app/core/shared/metadata.models';

describe('RegistrationDataCreateUserResolver', () => {
  let resolver: RegistrationDataCreateUserResolver;
  let epersonRegistrationService: jasmine.SpyObj<EpersonRegistrationService>;
  let epersonDataService: jasmine.SpyObj<EPersonDataService>;

  const registrationDataMock = {
    registrationType: 'orcid',
    email: 'test@test.com',
    netId: '0000-0000-0000-0000',
    user: null,
    registrationMetadata: {
      'email': [{ value: 'test@test.com' }],
      'eperson.lastname': [{ value: 'Doe' }],
      'eperson.firstname': [{ value: 'John' }],
    },
  };

  const tokenMock = 'as552-5a5a5-5a5a5-5a5a5';


  beforeEach(() => {
    const spyEpersonRegistrationService = jasmine.createSpyObj('EpersonRegistrationService', [
      'searchByTokenAndUpdateData'
    ]);
    const spyEpersonDataService = jasmine.createSpyObj('EPersonDataService', [
      'createEPersonForToken'
    ]);

    TestBed.configureTestingModule({
      providers: [
        RegistrationDataCreateUserResolver,
        { provide: EpersonRegistrationService, useValue: spyEpersonRegistrationService },
        { provide: EPersonDataService, useValue: spyEpersonDataService }
      ]
    });
    resolver = TestBed.inject(RegistrationDataCreateUserResolver);
    epersonRegistrationService = TestBed.inject(EpersonRegistrationService) as jasmine.SpyObj<EpersonRegistrationService>;
    epersonDataService = TestBed.inject(EPersonDataService) as jasmine.SpyObj<EPersonDataService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  describe('resolve', () => {
    const token = tokenMock;
    const route = { params: { token: token } } as any;
    const state = {} as RouterStateSnapshot;

    it('should create a new user and return true when registration data does not contain a user', (done) => {
      const registration = new Registration();
      epersonRegistrationService.searchByTokenAndUpdateData.and.returnValue(createSuccessfulRemoteDataObject$(registration));

      const createdEPerson = new EPerson();
      createdEPerson.email = registrationDataMock.email;
      createdEPerson.metadata = {
        'eperson.lastname': [Object.assign(new MetadataValue(), { value: 'Doe' })],
        'eperson.firstname': [Object.assign(new MetadataValue(), { value: 'John' })],
      };
      createdEPerson.canLogIn = true;
      createdEPerson.requireCertificate = false;
      epersonDataService.createEPersonForToken.and.returnValue(createSuccessfulRemoteDataObject$(createdEPerson));

      resolver.resolve(route, state).subscribe((result) => {
        expect(result).toBeTrue();
        expect(epersonRegistrationService.searchByTokenAndUpdateData).toHaveBeenCalledWith(token);
        expect(epersonDataService.createEPersonForToken).toHaveBeenCalledWith(createdEPerson, token);
        done();
      });
    });

    it('should return false when search by token and update data fails', (done) => {
      epersonRegistrationService.searchByTokenAndUpdateData.and.returnValue(createFailedRemoteDataObject$());

      resolver.resolve(route, state).subscribe((result) => {
        expect(result).toBeFalse();
        expect(epersonRegistrationService.searchByTokenAndUpdateData).toHaveBeenCalledWith(token);
        expect(epersonDataService.createEPersonForToken).not.toHaveBeenCalled();
        done();
      });
    });

  });

  describe('createUserFromToken', () => {
    const token = tokenMock;
    const registrationData: RegistrationData = Object.assign(new RegistrationData(), registrationDataMock);

    it('should create a new user and return true', (done) => {
      const createdEPerson = new EPerson();
      createdEPerson.email = registrationData.email;
      createdEPerson.metadata = {
        'eperson.lastname': 'Doe', //[{ value: 'Doe' }],
        'eperson.firstname': 'John',// [{ value: 'John' }],
      } as any;
      createdEPerson.canLogIn = true;
      createdEPerson.requireCertificate = false;
      epersonDataService.createEPersonForToken.and.returnValue(createSuccessfulRemoteDataObject$(createdEPerson));

      resolver.createUserFromToken(token, registrationData).subscribe((result) => {
        expect(result).toBeTrue();
        expect(epersonDataService.createEPersonForToken).toHaveBeenCalledWith(createdEPerson, token);
        done();
      });
    });

    it('should return false when create EPerson for token fails', (done) => {
      epersonDataService.createEPersonForToken.and.returnValue(createFailedRemoteDataObject$());

      resolver.createUserFromToken(token, registrationData).subscribe((result) => {
        expect(result).toBeFalse();
        expect(epersonDataService.createEPersonForToken).toHaveBeenCalledWith(jasmine.any(EPerson), token);
        done();
      });
    });
  });
});
