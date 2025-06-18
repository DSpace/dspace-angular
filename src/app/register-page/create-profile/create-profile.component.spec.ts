import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { AuthenticateAction } from '../../core/auth/auth.actions';
import { CoreState } from '../../core/core-state.model';
import {
  END_USER_AGREEMENT_METADATA_FIELD,
  EndUserAgreementService,
} from '../../core/end-user-agreement/end-user-agreement.service';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { Registration } from '../../core/shared/registration.model';
import { ProfilePageSecurityFormComponent } from '../../profile-page/profile-page-security-form/profile-page-security-form.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../shared/remote-data.utils';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { RouterStub } from '../../shared/testing/router.stub';
import { CreateProfileComponent } from './create-profile.component';

describe('CreateProfileComponent', () => {
  let comp: CreateProfileComponent;
  let fixture: ComponentFixture<CreateProfileComponent>;

  let router;
  let route;
  let ePersonDataService: EPersonDataService;
  let notificationsService;
  let store: Store<CoreState>;
  let endUserAgreementService: EndUserAgreementService;

  const registration = Object.assign(new Registration(), { email: 'test@email.org', token: 'test-token' });

  let values;
  let eperson: EPerson;
  let valuesWithAgreement;
  let epersonWithAgreement: EPerson;

  beforeEach(waitForAsync(() => {
    values = {
      metadata: {
        'eperson.firstname': [
          {
            value: 'First',
          },
        ],
        'eperson.lastname': [
          {
            value: 'Last',
          },
        ],
        'eperson.phone': [
          {
            value: 'Phone',
          },
        ],
        'eperson.language': [
          {
            value: 'en',
          },
        ],
      },
      email: 'test@email.org',
      password: 'password',
      canLogIn: true,
      requireCertificate: false,
    };
    eperson = Object.assign(new EPerson(), values);
    valuesWithAgreement = {
      metadata: {
        'eperson.firstname': [
          {
            value: 'First',
          },
        ],
        'eperson.lastname': [
          {
            value: 'Last',
          },
        ],
        'eperson.phone': [
          {
            value: 'Phone',
          },
        ],
        'eperson.language': [
          {
            value: 'en',
          },
        ],
        [END_USER_AGREEMENT_METADATA_FIELD]: [
          {
            value: 'true',
          },
        ],
      },
      email: 'test@email.org',
      password: 'password',
      canLogIn: true,
      requireCertificate: false,
    };
    epersonWithAgreement = Object.assign(new EPerson(), valuesWithAgreement);

    route = { data: of({ registration: createSuccessfulRemoteDataObject(registration) }) };
    router = new RouterStub();
    notificationsService = new NotificationsServiceStub();

    ePersonDataService = jasmine.createSpyObj('ePersonDataService', {
      createEPersonForToken: createSuccessfulRemoteDataObject$({}),
    });

    store = jasmine.createSpyObj('store', {
      dispatch: {},
    });

    endUserAgreementService = jasmine.createSpyObj('endUserAgreementService', {
      isCookieAccepted: false,
      removeCookieAccepted: {},
    });

    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), ReactiveFormsModule, CreateProfileComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: route },
        { provide: Store, useValue: store },
        { provide: EPersonDataService, useValue: ePersonDataService },
        { provide: UntypedFormBuilder, useValue: new UntypedFormBuilder() },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: EndUserAgreementService, useValue: endUserAgreementService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(CreateProfileComponent, {
        remove: { imports: [ProfilePageSecurityFormComponent] },
      })
      .compileComponents();
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

      expect(firstName).toBeDefined();
      expect(lastName).toBeDefined();
      expect(contactPhone).toBeDefined();
      expect(language).toBeDefined();
    });
  });

  describe('submitEperson', () => {

    it('should submit an eperson for creation and log in on success', () => {
      comp.firstName.patchValue('First');
      comp.lastName.patchValue('Last');
      comp.contactPhone.patchValue('Phone');
      comp.language.patchValue('en');
      comp.password = 'password';
      comp.isInValidPassword = false;

      comp.submitEperson();

      expect(ePersonDataService.createEPersonForToken).toHaveBeenCalledWith(eperson, 'test-token');
      expect(store.dispatch).toHaveBeenCalledWith(new AuthenticateAction('test@email.org', 'password'));
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
      expect(notificationsService.success).toHaveBeenCalled();
    });

    describe('when the end-user-agreement cookie is accepted', () => {
      beforeEach(() => {
        (endUserAgreementService.isCookieAccepted as jasmine.Spy).and.returnValue(true);
      });

      it('should submit an eperson with agreement metadata for creation and log in on success', () => {
        comp.firstName.patchValue('First');
        comp.lastName.patchValue('Last');
        comp.contactPhone.patchValue('Phone');
        comp.language.patchValue('en');
        comp.password = 'password';
        comp.isInValidPassword = false;

        comp.submitEperson();

        expect(ePersonDataService.createEPersonForToken).toHaveBeenCalledWith(epersonWithAgreement, 'test-token');
        expect(store.dispatch).toHaveBeenCalledWith(new AuthenticateAction('test@email.org', 'password'));
        expect(router.navigate).toHaveBeenCalledWith(['/home']);
        expect(notificationsService.success).toHaveBeenCalled();
      });

      it('should remove the cookie', () => {
        comp.firstName.patchValue('First');
        comp.lastName.patchValue('Last');
        comp.contactPhone.patchValue('Phone');
        comp.language.patchValue('en');
        comp.password = 'password';
        comp.isInValidPassword = false;

        comp.submitEperson();

        expect(endUserAgreementService.removeCookieAccepted).toHaveBeenCalled();
      });
    });

    it('should submit an eperson for creation and stay on page on error', () => {

      (ePersonDataService.createEPersonForToken as jasmine.Spy).and.returnValue(createFailedRemoteDataObject$('Error', 500));

      comp.firstName.patchValue('First');
      comp.lastName.patchValue('Last');
      comp.contactPhone.patchValue('Phone');
      comp.language.patchValue('en');
      comp.password = 'password';
      comp.isInValidPassword = false;

      comp.submitEperson();

      expect(ePersonDataService.createEPersonForToken).toHaveBeenCalledWith(eperson, 'test-token');
      expect(store.dispatch).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(notificationsService.error).toHaveBeenCalled();
    });

    it('should submit not create an eperson when the user info form is invalid', () => {

      (ePersonDataService.createEPersonForToken as jasmine.Spy).and.returnValue(createFailedRemoteDataObject$('Error', 500));

      comp.firstName.patchValue('');
      comp.lastName.patchValue('Last');
      comp.contactPhone.patchValue('Phone');
      comp.language.patchValue('en');
      comp.password = 'password';
      comp.isInValidPassword = false;

      comp.submitEperson();

      expect(ePersonDataService.createEPersonForToken).not.toHaveBeenCalled();
    });
    it('should submit not create an eperson when the password is invalid', () => {

      (ePersonDataService.createEPersonForToken as jasmine.Spy).and.returnValue(createFailedRemoteDataObject$('Error', 500));

      comp.firstName.patchValue('First');
      comp.lastName.patchValue('Last');
      comp.contactPhone.patchValue('Phone');
      comp.language.patchValue('en');
      comp.password = 'password';
      comp.isInValidPassword = true;

      comp.submitEperson();

      expect(ePersonDataService.createEPersonForToken).not.toHaveBeenCalled();
    });

  });
});
