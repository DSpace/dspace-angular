import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEmailComponent } from './confirm-email.component';
import { FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../shared/mocks/translate-loader.mock';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { ExternalLoginService } from '../../services/external-login.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { EPersonDataService } from '../../../../core/eperson/eperson-data.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { AuthMethodType } from '../../../../core/auth/models/auth.method-type';
import { createFailedRemoteDataObject$, createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { EPerson } from '../../../../core/eperson/models/eperson.model';
import { Router } from '@angular/router';
import { RouterMock } from '../../../../shared/mocks/router.mock';
import { of } from 'rxjs';
import { Registration } from '../../../../core/shared/registration.model';

describe('ConfirmEmailComponent', () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;
  let externalLoginServiceSpy: jasmine.SpyObj<ExternalLoginService>;
  let epersonDataServiceSpy: jasmine.SpyObj<EPersonDataService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationsService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router;
  const translateServiceStub = {
    get: () => of(''),
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter()
  };

  beforeEach(async () => {
    externalLoginServiceSpy = jasmine.createSpyObj('ExternalLoginService', [
      'patchUpdateRegistration',
    ]);
    epersonDataServiceSpy = jasmine.createSpyObj('EPersonDataService', [
      'createEPersonForToken',
    ]);
    notificationServiceSpy = jasmine.createSpyObj('NotificationsService', [
      'error',
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['setRedirectUrl']);
    router = new RouterMock();
    await TestBed.configureTestingModule({
      declarations: [ConfirmEmailComponent],
      providers: [
        FormBuilder,
        { provide: ExternalLoginService, useValue: externalLoginServiceSpy },
        { provide: EPersonDataService, useValue: epersonDataServiceSpy },
        { provide: NotificationsService, useValue: notificationServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: router },
        { provide: TranslateService, useValue: translateServiceStub }
      ],
      imports: [
        CommonModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
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

  describe('submitForm', () => {
    it('should call postCreateAccountFromToken if email is confirmed', () => {
      component.emailForm.setValue({ email: 'test@example.com' });
      spyOn(component as any, 'postCreateAccountFromToken');
      component.submitForm();
      expect((component as any).postCreateAccountFromToken).toHaveBeenCalledWith(
        'test-token',
        component.registrationData
      );
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
      expect((component as any).postCreateAccountFromToken).not.toHaveBeenCalled();
      expect((component as any).patchUpdateRegistration).not.toHaveBeenCalled();
    });
  });

  describe('postCreateAccountFromToken', () => {
    it('should call epersonDataService.createEPersonForToken with correct arguments', () => {
      epersonDataServiceSpy.createEPersonForToken.and.returnValue(createSuccessfulRemoteDataObject$(new EPerson()));
      (component as any).postCreateAccountFromToken(
        'test-token',
        component.registrationData
      );
      expect(epersonDataServiceSpy.createEPersonForToken).toHaveBeenCalledWith(
        jasmine.any(Object),
        'test-token'
      );
    });

    it('should show error notification if user creation fails', () => {
      epersonDataServiceSpy.createEPersonForToken.and.returnValue(
        createFailedRemoteDataObject$()
      );
      (component as any).postCreateAccountFromToken(
        'test-token',
        component.registrationData
      );
      expect(notificationServiceSpy.error).toHaveBeenCalled();
    });

    it('should redirect to login page if user creation succeeds', () => {
      epersonDataServiceSpy.createEPersonForToken.and.returnValue(
        createSuccessfulRemoteDataObject$(new EPerson())
      );
      (component as any).postCreateAccountFromToken(
        'test-token',
        component.registrationData
      );
      expect((component as any).router.navigate).toHaveBeenCalledWith(['/login'], {
        queryParams: { authMethod: 'orcid' },
      });
    });
  });

  afterEach(() => {
    fixture.destroy();
  });
});
