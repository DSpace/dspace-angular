import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { RestResponse } from '../core/cache/response.models';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EpersonRegistrationService } from '../core/data/eperson-registration.service';
import { By } from '@angular/platform-browser';
import { RouterStub } from '../shared/testing/router.stub';
import { NotificationsServiceStub } from '../shared/testing/notifications-service.stub';
import {
  RegisterEmailFormComponent,
  TYPE_REQUEST_REGISTER,
  TYPE_REQUEST_FORGOT
} from './register-email-form.component';
import { createSuccessfulRemoteDataObject$, createFailedRemoteDataObject$ } from '../shared/remote-data.utils';
import { ConfigurationDataService } from '../core/data/configuration-data.service';
import { ConfigurationProperty } from '../core/shared/configuration-property.model';

describe('RegisterEmailFormComponent', () => {

  let comp: RegisterEmailFormComponent;
  let fixture: ComponentFixture<RegisterEmailFormComponent>;

  let router;
  let epersonRegistrationService: EpersonRegistrationService;
  let notificationsService;
  let configurationDataService: ConfigurationDataService;

  beforeEach(waitForAsync(() => {

    router = new RouterStub();
    notificationsService = new NotificationsServiceStub();

    epersonRegistrationService = jasmine.createSpyObj('epersonRegistrationService', {
      registerEmail: createSuccessfulRemoteDataObject$({})
    });

    configurationDataService = jasmine.createSpyObj('configurationDataService', {
      findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
        name: 'authentication-password.domain.valid',
        values: [
          'example.com, @gmail.com'
        ]
      }))
    });
    jasmine.getEnv().allowRespy(true);

    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), ReactiveFormsModule],
      declarations: [RegisterEmailFormComponent],
      providers: [
        {provide: Router, useValue: router},
        {provide: EpersonRegistrationService, useValue: epersonRegistrationService},
        {provide: FormBuilder, useValue: new FormBuilder()},
        {provide: NotificationsService, useValue: notificationsService},
        {provide: ConfigurationDataService, useValue: configurationDataService},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterEmailFormComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
  });
  describe('init', () => {
    it('should initialise the form', () => {
      const elem = fixture.debugElement.queryAll(By.css('input#email'))[0].nativeElement;
      expect(elem).toBeDefined();
    });

    it('should not retrieve the validDomains for TYPE_REQUEST_FORGOT', () => {
      spyOn(configurationDataService, 'findByPropertyName');
      comp.typeRequest = TYPE_REQUEST_FORGOT;

      comp.ngOnInit();

      expect(configurationDataService.findByPropertyName).not.toHaveBeenCalled();
    });
  });
  describe('email validation', () => {
    it('should be invalid when no email is present', () => {
      expect(comp.form.invalid).toBeTrue();
    });
    it('should be invalid when no valid email is present', () => {
      comp.form.patchValue({email: 'invalid'});
      expect(comp.form.invalid).toBeTrue();
    });
    it('should be valid when a valid email is present', () => {
      comp.form.patchValue({email: 'valid@email.org'});
      expect(comp.form.invalid).toBeFalse();
    });
  });
  describe('register', () => {
    it('should send a registration to the service and on success display a message and return to home', () => {
      comp.form.patchValue({email: 'valid@email.org'});

      comp.register();
      expect(epersonRegistrationService.registerEmail).toHaveBeenCalledWith('valid@email.org', null);
      expect(notificationsService.success).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });
    it('should send a registration to the service and on error display a message', () => {
      (epersonRegistrationService.registerEmail as jasmine.Spy).and.returnValue(observableOf(new RestResponse(false, 400, 'Bad Request')));

      comp.form.patchValue({email: 'valid@email.org'});

      comp.register();
      expect(epersonRegistrationService.registerEmail).toHaveBeenCalledWith('valid@email.org', null);
      expect(notificationsService.error).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
