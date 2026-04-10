import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { RestResponse } from '../core/cache/response.models';
import { ConfigurationDataService } from '../core/data/configuration-data.service';
import { EpersonRegistrationService } from '../core/data/eperson-registration.service';
import { GoogleRecaptchaService } from '../core/google-recaptcha/google-recaptcha.service';
import { CookieService } from '../core/services/cookie.service';
import { ConfigurationProperty } from '../core/shared/configuration-property.model';
import { AlertComponent } from '../shared/alert/alert.component';
import { GoogleRecaptchaComponent } from '../shared/google-recaptcha/google-recaptcha.component';
import { CookieServiceMock } from '../shared/mocks/cookie.service.mock';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { NotificationsServiceStub } from '../shared/testing/notifications-service.stub';
import { RouterStub } from '../shared/testing/router.stub';
import {
  RegisterEmailFormComponent,
  TYPE_REQUEST_FORGOT,
  TYPE_REQUEST_REGISTER,
} from './register-email-form.component';

describe('RegisterEmailFormComponent', () => {

  let comp: RegisterEmailFormComponent;
  let fixture: ComponentFixture<RegisterEmailFormComponent>;

  let router;
  let epersonRegistrationService: EpersonRegistrationService;
  let notificationsService;

  const configurationDataService = jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: jasmine.createSpy('findByPropertyName'),
  });

  const captchaVersion$ = of('v3');
  const captchaMode$ = of('invisible');
  const confResponse$ = createSuccessfulRemoteDataObject$({ values: ['true'] });
  const confResponseDisabled$ = createSuccessfulRemoteDataObject$({ values: ['false'] });

  const googleRecaptchaService = jasmine.createSpyObj('googleRecaptchaService', {
    getRecaptchaToken: Promise.resolve('googleRecaptchaToken'),
    executeRecaptcha: Promise.resolve('googleRecaptchaToken'),
    getRecaptchaTokenResponse: Promise.resolve('googleRecaptchaToken'),
    captchaVersion: captchaVersion$,
    captchaMode: captchaMode$,
  });
  beforeEach(waitForAsync(() => {

    router = new RouterStub();
    notificationsService = new NotificationsServiceStub();

    epersonRegistrationService = jasmine.createSpyObj('epersonRegistrationService', {
      registerEmail: createSuccessfulRemoteDataObject$({}),
    });

    jasmine.getEnv().allowRespy(true);

    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), ReactiveFormsModule, RegisterEmailFormComponent, FormsModule],
      providers: [
        { provide: Router, useValue: router },
        { provide: EpersonRegistrationService, useValue: epersonRegistrationService },
        { provide: ConfigurationDataService, useValue: configurationDataService },
        { provide: UntypedFormBuilder, useValue: new UntypedFormBuilder() },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: CookieService, useValue: new CookieServiceMock() },
        { provide: GoogleRecaptchaService, useValue: googleRecaptchaService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(RegisterEmailFormComponent, {
      remove: { imports: [GoogleRecaptchaComponent, AlertComponent] },
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterEmailFormComponent);
    comp = fixture.componentInstance;
    googleRecaptchaService.captchaVersion$ = captchaVersion$;
    googleRecaptchaService.captchaMode$ = captchaMode$;
    configurationDataService.findByPropertyName.and.returnValues(confResponseDisabled$, confResponseDisabled$, confResponseDisabled$, confResponseDisabled$, confResponseDisabled$, confResponseDisabled$, confResponseDisabled$, confResponseDisabled$, confResponseDisabled$, confResponseDisabled$);

    fixture.detectChanges();
  });
  describe('init', () => {
    it('should initialise the form', () => {
      const elem = fixture.debugElement.queryAll(By.css('input#email'))[0].nativeElement;
      expect(elem).toBeDefined();
    });
  });
  describe('email validation', () => {
    it('should be invalid when no email is present', () => {
      expect(comp.form.invalid).toBeTrue();
    });
    it('should be invalid when no valid email is present', () => {
      comp.form.patchValue({ email: 'invalid' });
      expect(comp.form.invalid).toBeTrue();
    });
    it('should be valid when a valid email is present', () => {
      comp.form.patchValue({ email: 'valid@email.org' });
      expect(comp.form.invalid).toBeFalse();
    });
    it('should accept email with other domain names on TYPE_REQUEST_FORGOT form', () => {
      spyOn(configurationDataService, 'findByPropertyName').and.returnValue(createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
        name: 'authentication-password.domain.valid',
        values: ['marvel.com'],
      })));
      comp.typeRequest = TYPE_REQUEST_FORGOT;

      comp.ngOnInit();

      comp.form.patchValue({ email: 'valid@email.org' });
      expect(comp.form.invalid).toBeFalse();
    });
    it('should be valid when uppercase letters are used', () => {
      comp.form.patchValue({ email: 'VALID@email.org' });
      expect(comp.form.invalid).toBeFalse();
    });
    it('should not accept email with other domain names', () => {
      spyOn(configurationDataService, 'findByPropertyName').and.returnValue(createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
        name: 'authentication-password.domain.valid',
        values: ['marvel.com'],
      })));
      comp.typeRequest = TYPE_REQUEST_REGISTER;

      comp.ngOnInit();

      comp.form.patchValue({ email: 'valid@email.org' });
      expect(comp.form.invalid).toBeTrue();
    });
    it('should accept email with the given domain name', () => {
      spyOn(configurationDataService, 'findByPropertyName').and.returnValue(createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
        name: 'authentication-password.domain.valid',
        values: ['marvel.com'],
      })));
      comp.typeRequest = TYPE_REQUEST_REGISTER;

      comp.ngOnInit();

      comp.form.patchValue({ email: 'thor.odinson@marvel.com' });
      expect(comp.form.invalid).toBeFalse();
    });
  });
  describe('register', () => {
    it('should send a registration to the service and on success display a message and return to home', () => {
      comp.form.patchValue({ email: 'valid@email.org' });

      comp.register();
      expect(epersonRegistrationService.registerEmail).toHaveBeenCalledWith('valid@email.org', null, null);
      expect(notificationsService.success).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });
    it('should send a registration to the service and on error display a message', () => {
      (epersonRegistrationService.registerEmail as jasmine.Spy).and.returnValue(of(new RestResponse(false, 400, 'Bad Request')));

      comp.form.patchValue({ email: 'valid@email.org' });

      comp.register();
      expect(epersonRegistrationService.registerEmail).toHaveBeenCalledWith('valid@email.org', null, null);
      expect(notificationsService.error).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
  describe('register with google recaptcha', () => {
    beforeEach(fakeAsync(() => {
      configurationDataService.findByPropertyName.and.returnValues(confResponse$, confResponse$, confResponse$, confResponse$, confResponse$, confResponse$, confResponse$, confResponse$, confResponse$, confResponse$);
      googleRecaptchaService.captchaVersion$ = captchaVersion$;
      googleRecaptchaService.captchaMode$ = captchaMode$;
      comp.ngOnInit();
      fixture.detectChanges();
    }));

    it('should send a registration to the service and on success display a message and return to home', fakeAsync(() => {
      comp.form.patchValue({ email: 'valid@email.org' });
      comp.register();
      tick();
      expect(epersonRegistrationService.registerEmail).toHaveBeenCalledWith('valid@email.org', 'googleRecaptchaToken', null);
      expect(notificationsService.success).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    }));
    it('should send a registration to the service and on error display a message', fakeAsync(() => {
      (epersonRegistrationService.registerEmail as jasmine.Spy).and.returnValue(of(new RestResponse(false, 400, 'Bad Request')));

      comp.form.patchValue({ email: 'valid@email.org' });

      comp.register();
      tick();
      expect(epersonRegistrationService.registerEmail).toHaveBeenCalledWith('valid@email.org', 'googleRecaptchaToken', null);
      expect(notificationsService.error).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    }));
  });
});
