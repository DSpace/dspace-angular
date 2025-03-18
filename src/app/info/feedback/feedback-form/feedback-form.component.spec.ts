import {
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { RouterStub } from 'src/app/shared/testing/router.stub';

import { AuthService } from '../../../core/auth/auth.service';
import { ConfigurationDataService } from '../../../core/data/configuration-data.service';
import { FeedbackDataService } from '../../../core/feedback/feedback-data.service';
import { Feedback } from '../../../core/feedback/models/feedback.model';
import { GoogleRecaptchaService } from '../../../core/google-recaptcha/google-recaptcha.service';
import { CookieService } from '../../../core/services/cookie.service';
import { RouteService } from '../../../core/services/route.service';
import { NativeWindowService } from '../../../core/services/window.service';
import { BtnDisabledDirective } from '../../../shared/btn-disabled.directive';
import { CookieServiceMock } from '../../../shared/mocks/cookie.service.mock';
import { NativeWindowMockFactory } from '../../../shared/mocks/mock-native-window-ref';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../../../shared/remote-data.utils';
import { AuthServiceStub } from '../../../shared/testing/auth-service.stub';
import { EPersonMock } from '../../../shared/testing/eperson.mock';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { routeServiceStub } from '../../../shared/testing/route-service.stub';
import { FeedbackFormComponent } from './feedback-form.component';


describe('FeedbackFormComponent', () => {
  let router;
  let component: FeedbackFormComponent;
  let fixture: ComponentFixture<FeedbackFormComponent>;
  let de: DebugElement;
  let notificationsService;


  const feedbackDataService = jasmine.createSpyObj('feedbackDataService', {
    registerFeedback: createSuccessfulRemoteDataObject$(new Feedback()),
    create: createSuccessfulRemoteDataObject$(new Feedback()),
  });
  const captchaVersion$ = of('v3');
  const captchaMode$ = of('invisible');
  const confFeedbackVerificationEnabled$ = createSuccessfulRemoteDataObject$({ values: ['true'] });
  const authService: AuthServiceStub = Object.assign(new AuthServiceStub(), {
    getAuthenticatedUserFromStore: () => {
      return of(EPersonMock);
    },
  });

  const configurationDataService = jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: jasmine.createSpy('findByPropertyName'),
  });

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

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), FeedbackFormComponent, BtnDisabledDirective],
      providers: [
        { provide: RouteService, useValue: routeServiceStub },
        { provide: UntypedFormBuilder, useValue: new UntypedFormBuilder() },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: FeedbackDataService, useValue: feedbackDataService },
        { provide: AuthService, useValue: authService },
        { provide: NativeWindowService, useFactory: NativeWindowMockFactory },
        { provide: Router, useValue: router },
        { provide: CookieService, useValue: new CookieServiceMock() },
        { provide: GoogleRecaptchaService, useValue: googleRecaptchaService },
        { provide: ConfigurationDataService, useValue: configurationDataService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackFormComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    googleRecaptchaService.captchaVersion$ = captchaVersion$;
    googleRecaptchaService.captchaMode$ = captchaMode$;
    configurationDataService.findByPropertyName.and.returnValues(confFeedbackVerificationEnabled$, confFeedbackVerificationEnabled$, confFeedbackVerificationEnabled$, confFeedbackVerificationEnabled$, confFeedbackVerificationEnabled$, confFeedbackVerificationEnabled$, confFeedbackVerificationEnabled$, confFeedbackVerificationEnabled$, confFeedbackVerificationEnabled$, confFeedbackVerificationEnabled$);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have page value', () => {
    expect(component.feedbackForm.controls.page.value).toEqual('http://localhost/home');
  });

  it('should have email if ePerson', () => {
    expect(component.feedbackForm.controls.email.value).toEqual('test@test.com');
  });

  it('should have disabled button', () => {
    expect(component.registrationVerification).toBeTrue();
    if (component.registrationVerification === true) {
      expect(de.query(By.css('button')).nativeElement.getAttribute('aria-disabled')).toBe('true');
      expect(de.query(By.css('button')).nativeElement.classList.contains('disabled')).toBeTrue();
    } else {
      expect(de.query(By.css('button')).nativeElement.getAttribute('aria-disabled')).toBe('false');
      expect(de.query(By.css('button')).nativeElement.classList.contains('disabled')).toBeTrue();
    }
  });

  describe('when message is inserted', () => {

    beforeEach(() => {
      component.feedbackForm.patchValue({ message: 'new feedback' });
      fixture.detectChanges();
    });

    it('should not have disabled button', () => {
      if (component.registrationVerification === true) {
        expect(de.query(By.css('button')).nativeElement.getAttribute('aria-disabled')).toBe('true');
        expect(de.query(By.css('button')).nativeElement.classList.contains('disabled')).toBeTrue();
      } else {
        expect(de.query(By.css('button')).nativeElement.getAttribute('aria-disabled')).toBe('false');
        expect(de.query(By.css('button')).nativeElement.classList.contains('disabled')).toBeFalse();
      }
    });

    it('on submit should call create of feedbackDataServiceStub service', () => {
      component.createFeedback();
      fixture.detectChanges();
      expect(feedbackDataService.registerFeedback).toHaveBeenCalled();
    });
  });

  describe('register with google recaptcha', () => {
    beforeEach(fakeAsync(() => {
      configurationDataService.findByPropertyName.and.returnValues(confFeedbackVerificationEnabled$, confFeedbackVerificationEnabled$, confFeedbackVerificationEnabled$, confFeedbackVerificationEnabled$, confFeedbackVerificationEnabled$, confFeedbackVerificationEnabled$, confFeedbackVerificationEnabled$, confFeedbackVerificationEnabled$, confFeedbackVerificationEnabled$, confFeedbackVerificationEnabled$);
      googleRecaptchaService.captchaVersion$ = captchaVersion$;
      googleRecaptchaService.captchaMode$ = captchaMode$;
      component.ngOnInit();
      fixture.detectChanges();
    }));

    it('should send a registration to the service and on success display a message and return to home', fakeAsync(() => {
      component.feedbackForm.patchValue({ message: 'new feedback',page: 'http://localhost/home',email: 'test@test.com' });
      fixture.detectChanges();
      tick();
      component.send('googleRecaptchaToken');
      tick();
      expect(feedbackDataService.registerFeedback).toHaveBeenCalledWith({ message: 'new feedback', page: 'http://localhost/home', email: 'test@test.com' },'googleRecaptchaToken');
      expect(notificationsService.success).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith('/home');
    }));
    it('should send a registration to the service and on error display a message',
      fakeAsync(() => {
        (feedbackDataService.registerFeedback as jasmine.Spy).and.returnValue(createFailedRemoteDataObject$('Bad request',400));
        component.feedbackForm.patchValue({ message: 'new feedback', page: 'http://localhost/home', email: 'test@test.com' });
        fixture.detectChanges();
        tick();
        component.send('googleRecaptchaToken');
        tick();
        expect(feedbackDataService.registerFeedback).toHaveBeenCalledWith({ message: 'new feedback', page: 'http://localhost/home', email: 'test@test.com' },'googleRecaptchaToken');
        tick();
        expect(notificationsService.error).toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
      }));
  });
});
