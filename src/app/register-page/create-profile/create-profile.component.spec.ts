import { CreateProfileComponent } from './create-profile.component';
import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { Registration } from '../../core/shared/registration.model';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { of, of as observableOf } from 'rxjs';
import { By } from '@angular/platform-browser';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { AuthenticateAction } from '../../core/auth/auth.actions';
import { RouterStub } from '../../shared/testing/router.stub';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import {
  END_USER_AGREEMENT_METADATA_FIELD,
  EndUserAgreementService
} from '../../core/end-user-agreement/end-user-agreement.service';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$
} from '../../shared/remote-data.utils';
import { CoreState } from '../../core/core-state.model';

describe('CreateProfileComponent', () => {
  let comp: CreateProfileComponent;
  let fixture: ComponentFixture<CreateProfileComponent>;
  let authService: any;
  const ePerson = Object.assign(new EPerson(), {
    id: 'test-eperson',
    uuid: 'test-eperson',
    email: 'albamail@atis.al'
  });
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
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: observableOf(true),
      setRedirectUrl: {},
      getAuthenticatedUserFromStore: observableOf(ePerson)
    });
    values = {
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
    eperson = Object.assign(new EPerson(), values);
    valuesWithAgreement = {
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
        ],
        [END_USER_AGREEMENT_METADATA_FIELD]: [
          {
            value: 'true'
          }
        ]
      },
      email: 'test@email.org',
      password: 'password',
      canLogIn: true,
      requireCertificate: false
    };
    epersonWithAgreement = Object.assign(new EPerson(), valuesWithAgreement);

    route = {data: observableOf({registration: createSuccessfulRemoteDataObject(registration)})};
    router = new RouterStub();
    notificationsService = new NotificationsServiceStub();

    ePersonDataService = jasmine.createSpyObj('ePersonDataService', {
      createEPersonForToken: createSuccessfulRemoteDataObject$({})
    });

    store = jasmine.createSpyObj('store', {
      dispatch: {},
    });

    endUserAgreementService = jasmine.createSpyObj('endUserAgreementService', {
      isCookieAccepted: false,
      removeCookieAccepted: {},
      isUserAgreementEnabled: of(true),
    });

    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), ReactiveFormsModule],
      declarations: [CreateProfileComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: route },
        { provide: Store, useValue: store },
        { provide: EPersonDataService, useValue: ePersonDataService },
        {provide: UntypedFormBuilder, useValue: new UntypedFormBuilder()},
        { provide: NotificationsService, useValue: notificationsService },
        { provide: EndUserAgreementService, useValue: endUserAgreementService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProfileComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
  });
  describe('when hasGroups is false', () => {
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
        comp.userAgreementAccept.patchValue(true);
        comp.isInValidPassword = false;

        comp.submitEperson();

        expect(ePersonDataService.createEPersonForToken).toHaveBeenCalledWith(epersonWithAgreement, 'test-token');
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
          comp.userAgreementAccept.patchValue(true);
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
          comp.userAgreementAccept.patchValue(true);
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
        comp.userAgreementAccept.patchValue(true);
        comp.isInValidPassword = false;

        comp.submitEperson();

        expect(ePersonDataService.createEPersonForToken).toHaveBeenCalledWith(epersonWithAgreement, 'test-token');
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
        comp.userAgreementAccept.patchValue(true);
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
        comp.userAgreementAccept.patchValue(true);
        comp.isInValidPassword = true;

        comp.submitEperson();

        expect(ePersonDataService.createEPersonForToken).not.toHaveBeenCalled();
      });

    });

  });

  describe('when hasGroups is true', () => {
    beforeEach(() => {
      comp.hasGroups = true;
      fixture.detectChanges();
    });

    describe('and the user clicks "login with existing user" option', () => {
      it('should navigate to invitation page', fakeAsync(() => {
        const invitationButton = fixture.debugElement.queryAll(By.css('button.btn-link'))[0];
        invitationButton.triggerEventHandler('click', null);
        flush();
        expect(router.navigate).toHaveBeenCalledWith(['invitation', 'test-token']);
      }));

    });
  });

});
