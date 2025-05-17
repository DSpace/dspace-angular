import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateService } from '@ngx-translate/core';
import { getTestScheduler } from 'jasmine-marbles';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { EpersonRegistrationService } from '../../core/data/eperson-registration.service';
import { RemoteData } from '../../core/data/remote-data';
import { NoContent } from '../../core/shared/NoContent.model';
import { Registration } from '../../core/shared/registration.model';
import { RouterMock } from '../../shared/mocks/router.mock';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import {
  createFailedRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../shared/remote-data.utils';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { ExternalLoginService } from './external-login.service';

describe('ExternalLoginService', () => {
  let service: ExternalLoginService;
  let epersonRegistrationService;
  let router: any;
  let notificationService;
  let translate;
  let scheduler: TestScheduler;

  const values = ['value1', 'value2'];
  const field = 'field1';
  const registrationId = 'registrationId1';
  const token = 'token1';
  const operation = 'add';

  beforeEach(() => {
    epersonRegistrationService = jasmine.createSpyObj('epersonRegistrationService', {
      patchUpdateRegistration: createSuccessfulRemoteDataObject$(new Registration),
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
        provideMockStore(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(ExternalLoginService);
    scheduler = getTestScheduler();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call epersonRegistrationService.patchUpdateRegistration with the correct parameters', () => {
    epersonRegistrationService.patchUpdateRegistration.and.returnValue(of({} as RemoteData<Registration>));
    service.patchUpdateRegistration(values, field, registrationId, token, operation);
    expect(epersonRegistrationService.patchUpdateRegistration).toHaveBeenCalledWith(values, field, registrationId, token, operation);
  });

  it('should navigate to /email-confirmation if the remote data has succeeded', () => {
    epersonRegistrationService.patchUpdateRegistration.and.returnValue(createSuccessfulRemoteDataObject$(new Registration()));
    scheduler.schedule(() => service.patchUpdateRegistration(values, field, registrationId, token, operation).subscribe());
    scheduler.flush();
    expect((router as any).navigate).toHaveBeenCalledWith(['/email-confirmation']);
  });

  it('should show an error notification if the remote data has failed', fakeAsync(() => {
    const remoteData = createFailedRemoteDataObject<NoContent>('error message');
    epersonRegistrationService.patchUpdateRegistration.and.returnValue(of(remoteData));
    translate.get.and.returnValue(of('error message'));

    let result = null;
    service.patchUpdateRegistration(values, field, registrationId, token, operation).subscribe((data) => (result = data));
    tick(100);
    expect(result).toEqual(remoteData);
    expect(notificationService.error).toHaveBeenCalled();
  }));
});
