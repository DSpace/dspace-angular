import { EPersonMock } from '../../../shared/testing/eperson.mock';
import { FeedbackDataService } from '../../../core/feedback/feedback-data.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FeedbackFormComponent } from './feedback-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouteService } from '../../../core/services/route.service';
import { routeServiceStub } from '../../../shared/testing/route-service.stub';
import { FormBuilder } from '@angular/forms';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthServiceStub } from '../../../shared/testing/auth-service.stub';
import { of } from 'rxjs';
import { Feedback } from '../../../core/feedback/models/feedback.model';


describe('FeedbackFormComponent', () => {
  let component: FeedbackFormComponent;
  let fixture: ComponentFixture<FeedbackFormComponent>;
  let de: DebugElement;
  const notificationService = new NotificationsServiceStub();
  const feedbackDataServiceStub = jasmine.createSpyObj('feedbackDataService', {
    create: of(new Feedback())
  });
  const authService: AuthServiceStub = Object.assign(new AuthServiceStub(), {
    getAuthenticatedUserFromStore: () => {
      return of(EPersonMock);
    }
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [FeedbackFormComponent],
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
    fixture = TestBed.createComponent(FeedbackFormComponent);
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
      expect(feedbackDataServiceStub.create).toHaveBeenCalled();
    });
  });


});
