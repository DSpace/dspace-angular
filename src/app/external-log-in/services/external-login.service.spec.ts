import { TestBed } from '@angular/core/testing';

import { ExternalLoginService } from './external-login.service';
import { TranslateService } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { EpersonRegistrationService } from '../../core/data/eperson-registration.service';
import { RemoteData } from '../../core/data/remote-data';
import { Registration } from '../../core/shared/registration.model';
import { RouterMock } from '../../shared/mocks/router.mock';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';

describe('ExternalLoginService', () => {
  let service: ExternalLoginService;
  let epersonRegistrationService;
  let router: any;
  let notificationService;
  let translate;

  const values = ['value1', 'value2'];
  const field = 'field1';
  const registrationId = 'registrationId1';
  const token = 'token1';
  const operation = 'add';

  beforeEach(() => {
    epersonRegistrationService = jasmine.createSpyObj('epersonRegistrationService', {
      patchUpdateRegistration: createSuccessfulRemoteDataObject$(new Registration)
    });
    router = new RouterMock();
    notificationService = new NotificationsServiceStub();
    translate = jasmine.createSpyObj('TranslateService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        ExternalLoginService,
        { provide: EpersonRegistrationService, useValue: epersonRegistrationService },
        { provide: Router, useValue: router },
        { provide: NotificationsService, useValue: notificationService },
        { provide: TranslateService, useValue: translate },
        { provide: Store, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    service = TestBed.inject(ExternalLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call epersonRegistrationService.patchUpdateRegistration with the correct parameters', () => {
    epersonRegistrationService.patchUpdateRegistration.and.returnValue(observableOf({} as RemoteData<Registration>));
    service.patchUpdateRegistration(values, field, registrationId, token, operation);
    expect(epersonRegistrationService.patchUpdateRegistration).toHaveBeenCalledWith(values, field, registrationId, token, operation);
  });

  it('should navigate to /email-confirmation if the remote data has succeeded', () => {
    const remoteData = { hasSucceeded: true } as RemoteData<Registration>;
    epersonRegistrationService.patchUpdateRegistration.and.returnValue(observableOf(remoteData));
    service.patchUpdateRegistration(values, field, registrationId, token, operation).subscribe(() => {
      expect((router as any).navigate).toHaveBeenCalledWith(['/email-confirmation']);
    });
  });

  it('should show an error notification if the remote data has failed', () => {
    const remoteData = { hasFailed: true } as RemoteData<Registration>;
    epersonRegistrationService.patchUpdateRegistration.and.returnValue(observableOf(remoteData));
    translate.get.and.returnValue(observableOf('error message'));
    service.patchUpdateRegistration(values, field, registrationId, token, operation).subscribe(() => {
      expect(notificationService.error).toHaveBeenCalledWith('error message');
    });
  });
});
