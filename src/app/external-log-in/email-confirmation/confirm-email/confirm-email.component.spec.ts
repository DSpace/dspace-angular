import { CommonModule } from '@angular/common';
import {
  EventEmitter,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import {
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { AuthService } from '../../../core/auth/auth.service';
import { AuthMethodType } from '../../../core/auth/models/auth.method-type';
import { EPersonDataService } from '../../../core/eperson/eperson-data.service';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { HardRedirectService } from '../../../core/services/hard-redirect.service';
import { NativeWindowService } from '../../../core/services/window.service';
import { Registration } from '../../../core/shared/registration.model';
import {
  MockWindow,
  NativeWindowMockFactory,
} from '../../../shared/mocks/mock-native-window-ref';
import { TranslateLoaderMock } from '../../../shared/mocks/translate-loader.mock';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { ExternalLoginService } from '../../services/external-login.service';
import { ConfirmEmailComponent } from './confirm-email.component';

describe('ConfirmEmailComponent', () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;
  let externalLoginServiceSpy: jasmine.SpyObj<ExternalLoginService>;
  let epersonDataServiceSpy: jasmine.SpyObj<EPersonDataService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationsService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let hardRedirectService: HardRedirectService;

  const translateServiceStub = {
    get: () => of(''),
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter(),
  };

  beforeEach(async () => {
    externalLoginServiceSpy = jasmine.createSpyObj('ExternalLoginService', [
      'patchUpdateRegistration',
      'getExternalAuthLocation',
    ]);
    epersonDataServiceSpy = jasmine.createSpyObj('EPersonDataService', [
      'createEPersonForToken',
    ]);
    notificationServiceSpy = jasmine.createSpyObj('NotificationsService', [
      'error',
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getRedirectUrl', 'setRedirectUrl', 'getExternalServerRedirectUrl']);
    hardRedirectService = jasmine.createSpyObj('HardRedirectService', {
      redirect: {},
    });
    await TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        { provide: NativeWindowService, useFactory: NativeWindowMockFactory },
        { provide: ExternalLoginService, useValue: externalLoginServiceSpy },
        { provide: EPersonDataService, useValue: epersonDataServiceSpy },
        { provide: NotificationsService, useValue: notificationServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: TranslateService, useValue: translateServiceStub },
        { provide: HardRedirectService, useValue: hardRedirectService },
      ],
      imports: [
        CommonModule,
        ConfirmEmailComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        ReactiveFormsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmEmailComponent);
    component = fixture.componentInstance;
    component.registrationData = Object.assign(new Registration(), {
      id: '123',
      email: 'test@example.com',
      netId: 'test-netid',
      registrationMetadata: {},
      registrationType: AuthMethodType.Orcid,
    });
    component.token = 'test-token';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show email from registration data', () => {
    fixture.detectChanges();
    const emailInput = fixture.debugElement.query(By.css('input[id=email]'));
    expect(emailInput).toBeTruthy();
    expect(emailInput.nativeElement.value).toBe('test@example.com');
  });

  describe('submitForm', () => {
    it('should call postCreateAccountFromToken if email is confirmed', () => {
      component.emailForm.setValue({ email: 'test@example.com' });
      spyOn(component as any, 'postCreateAccountFromToken');
      component.submitForm();
      expect(
        (component as any).postCreateAccountFromToken,
      ).toHaveBeenCalledWith('test-token', component.registrationData);
    });

    it('should call patchUpdateRegistration if email is not confirmed', () => {
      component.emailForm.setValue({ email: 'new-email@example.com' });
      spyOn(component as any, 'patchUpdateRegistration');
      component.submitForm();
      expect((component as any).patchUpdateRegistration).toHaveBeenCalledWith([
        'new-email@example.com',
      ]);
    });

    it('should not call any methods if form is invalid', () => {
      component.emailForm.setValue({ email: 'invalid-email' });
      spyOn(component as any, 'postCreateAccountFromToken');
      spyOn(component as any, 'patchUpdateRegistration');
      component.submitForm();
      expect(
        (component as any).postCreateAccountFromToken,
      ).not.toHaveBeenCalled();
      expect((component as any).patchUpdateRegistration).not.toHaveBeenCalled();
    });
  });

  describe('postCreateAccountFromToken', () => {
    it('should call NotificationsService.error if the registration data does not have a netId', () => {
      component.registrationData.netId = undefined;
      (component as any).postCreateAccountFromToken('test-token', component.registrationData);
      expect(notificationServiceSpy.error).toHaveBeenCalled();
    });

    it('should call EPersonDataService.createEPersonForToken and ExternalLoginService.getExternalAuthLocation if the registration data has a netId', () => {
      externalLoginServiceSpy.getExternalAuthLocation.and.returnValue(of('test-location'));
      authServiceSpy.getRedirectUrl.and.returnValue(of('/test-redirect'));
      authServiceSpy.getExternalServerRedirectUrl.and.returnValue('test-external-url');
      epersonDataServiceSpy.createEPersonForToken.and.returnValue(createSuccessfulRemoteDataObject$(new EPerson()));
      (component as any).postCreateAccountFromToken('test-token', component.registrationData);
      expect(epersonDataServiceSpy.createEPersonForToken).toHaveBeenCalled();
      expect(externalLoginServiceSpy.getExternalAuthLocation).toHaveBeenCalledWith(AuthMethodType.Orcid);
      expect(authServiceSpy.getRedirectUrl).toHaveBeenCalled();
      expect(authServiceSpy.setRedirectUrl).toHaveBeenCalledWith('/profile');
      expect(authServiceSpy.getExternalServerRedirectUrl).toHaveBeenCalledWith(MockWindow.origin,'/test-redirect', 'test-location');
      expect(hardRedirectService.redirect).toHaveBeenCalledWith('test-external-url');
    });
  });

  afterEach(() => {
    fixture.destroy();
  });
});
