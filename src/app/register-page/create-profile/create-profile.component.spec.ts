import { CreateProfileComponent } from './create-profile.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Registration } from '../../core/shared/registration.model';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { RouterStub } from '../../shared/testing/router-stub';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { of as observableOf } from 'rxjs';
import { RestResponse } from '../../core/cache/response.models';
import { By } from '@angular/platform-browser';
import { GLOBAL_CONFIG } from '../../../config';
import { CoreState } from '../../core/core.reducers';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service-stub';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { AuthenticateAction } from '../../core/auth/auth.actions';

describe('CreateProfileComponent', () => {
  let comp: CreateProfileComponent;
  let fixture: ComponentFixture<CreateProfileComponent>;

  let router;
  let route;
  let ePersonDataService: EPersonDataService;
  let notificationsService;
  let store: Store<CoreState>;

  const registration = Object.assign(new Registration(), {email: 'test@email.org', token: 'test-token'});

  const values = {
    metadata: {
      'eperson.firstname': [
        {
          value: 'First'
        }
      ],
      'eperson.lastname': [
        {
          value: 'Last'
        },
      ],
      'eperson.phone': [
        {
          value: 'Phone'
        }
      ],
      'eperson.language': [
        {
          value: 'en'
        }
      ]
    },
    email: 'test@email.org',
    password: 'password',
    canLogIn: true,
    requireCertificate: false
  };
  const eperson = Object.assign(new EPerson(), values);

  beforeEach(async(() => {
    const mockConfig = {
      languages: [{
        code: 'en',
        label: 'English',
        active: true,
      }, {
        code: 'de',
        label: 'Deutsch',
        active: false
      }]
    };
    route = {data: observableOf({registration: registration})};
    router = new RouterStub();
    notificationsService = new NotificationsServiceStub();

    ePersonDataService = jasmine.createSpyObj('ePersonDataService', {
      createEPersonForToken: observableOf(new RestResponse(true, 200, 'Success'))
    });

    store = jasmine.createSpyObj('store', {
      dispatch: {},
    });

    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), ReactiveFormsModule],
      declarations: [CreateProfileComponent],
      providers: [
        {provide: GLOBAL_CONFIG, useValue: mockConfig},
        {provide: Router, useValue: router},
        {provide: ActivatedRoute, useValue: route},
        {provide: Store, useValue: store},
        {provide: EPersonDataService, useValue: ePersonDataService},
        {provide: FormBuilder, useValue: new FormBuilder()},
        {provide: NotificationsService, useValue: notificationsService},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProfileComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('init', () => {
    it('should initialise mail address', () => {
      const elem = fixture.debugElement.queryAll(By.css('span#email'))[0].nativeElement;
      expect(elem.innerHTML).toContain('test@email.org');
    });
    it('should initialise the form', () => {
      const firstName = fixture.debugElement.queryAll(By.css('input#firstName'))[0].nativeElement;
      const lastName = fixture.debugElement.queryAll(By.css('input#lastName'))[0].nativeElement;
      const contactPhone = fixture.debugElement.queryAll(By.css('input#contactPhone'))[0].nativeElement;
      const language = fixture.debugElement.queryAll(By.css('select#language'))[0].nativeElement;
      const password = fixture.debugElement.queryAll(By.css('input#password'))[0].nativeElement;
      const confirmPassword = fixture.debugElement.queryAll(By.css('input#confirmPassword'))[0].nativeElement;

      expect(firstName).toBeDefined();
      expect(lastName).toBeDefined();
      expect(contactPhone).toBeDefined();
      expect(language).toBeDefined();
      expect(password).toBeDefined();
      expect(confirmPassword).toBeDefined();
    });
  });

  describe('submitEperson', () => {

    it('should submit an eperson for creation and log in on success', () => {
      comp.firstName.patchValue('First');
      comp.lastName.patchValue('Last');
      comp.contactPhone.patchValue('Phone');
      comp.language.patchValue('en');
      comp.password.patchValue('password');
      comp.confirmPassword.patchValue('password');

      comp.submitEperson();

      expect(ePersonDataService.createEPersonForToken).toHaveBeenCalledWith(eperson, 'test-token');
      expect(store.dispatch).toHaveBeenCalledWith(new AuthenticateAction('test@email.org', 'password'));
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
      expect(notificationsService.success).toHaveBeenCalled();
    });

    it('should submit an eperson for creation and stay on page on error', () => {

      (ePersonDataService.createEPersonForToken as jasmine.Spy).and.returnValue(observableOf(new RestResponse(false, 500, 'Error')));

      comp.firstName.patchValue('First');
      comp.lastName.patchValue('Last');
      comp.contactPhone.patchValue('Phone');
      comp.language.patchValue('en');
      comp.password.patchValue('password');
      comp.confirmPassword.patchValue('password');

      comp.submitEperson();

      expect(ePersonDataService.createEPersonForToken).toHaveBeenCalledWith(eperson, 'test-token');
      expect(store.dispatch).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(notificationsService.error).toHaveBeenCalled();
    });
  });
});
