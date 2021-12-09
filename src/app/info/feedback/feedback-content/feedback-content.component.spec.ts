import { EPersonMock } from './../../../shared/testing/eperson.mock';
import { FeedbackDataService } from './../../../core/feedback/feedback-data.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FeedbackContentComponent } from './feedback-content.component';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouteService } from 'src/app/core/services/route.service';
import { routeServiceStub } from 'src/app/shared/testing/route-service.stub';
import { FormBuilder } from '@angular/forms';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { NotificationsServiceStub } from 'src/app/shared/testing/notifications-service.stub';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AuthServiceStub } from 'src/app/shared/testing/auth-service.stub';
import { of } from 'rxjs/internal/observable/of';
import { Feedback } from '../../../core/feedback/models/feedback.model';


describe('FeedbackContentComponent', () => {
  let component: FeedbackContentComponent;
  let fixture: ComponentFixture<FeedbackContentComponent>;
  let de: DebugElement;
  const notificationService = new NotificationsServiceStub();
  const feedbackDataServiceStub = jasmine.createSpyObj('feedbackDataService', {
    createFeedback: of(new Feedback())
  });
  const authService: AuthServiceStub = Object.assign(new AuthServiceStub(), {
    getAuthenticatedUserFromStore: () => {
      return of(EPersonMock);
    }
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [FeedbackContentComponent],
      providers: [
        { provide: RouteService, useValue: routeServiceStub },
        { provide: FormBuilder, useValue: new FormBuilder() },
        { provide: NotificationsService, useValue: notificationService },
        { provide: FeedbackDataService, useValue: feedbackDataServiceStub },
        { provide: AuthService, useValue: authService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackContentComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have page value', () => {
    expect(de.query(By.css('input[name=page]')).nativeElement.value).toEqual('/home');
  });

  it('should have email if ePerson', () => {
    expect(component.feedbackForm.controls.email.value).toEqual('test@test.com');
  });

  it('should have disabled button', () => {
    expect(de.query(By.css('button')).nativeElement.disabled).toBeTrue();
  });

  describe('when message is inserted', () => {

    beforeEach(() => {
      component.feedbackForm.patchValue({ message: 'new feedback' });
      fixture.detectChanges();
    });

    it('should not have disabled button', () => {
      expect(de.query(By.css('button')).nativeElement.disabled).toBeFalse();
    });

    it('on submit should call createFeedback of feedbackDataServiceStub service', () => {
      component.createFeedback();
      fixture.detectChanges();
      expect(feedbackDataServiceStub.createFeedback).toHaveBeenCalled();
    });
  });


});
