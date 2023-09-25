import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ExternalLoginReviewAccountInfoPageComponent } from './external-login-review-account-info-page.component';
import { mockRegistrationDataModel } from '../external-log-in/models/registration-data.mock.model';

describe('ExternalLoginReviewAccountInfoPageComponent', () => {
  let component: ExternalLoginReviewAccountInfoPageComponent;
  let fixture: ComponentFixture<ExternalLoginReviewAccountInfoPageComponent>;

  const mockActivatedRoute = {
    snapshot: {
      params: {
        token: '1234567890'
      }
    },
    data: of({
      registrationData: mockRegistrationDataModel
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExternalLoginReviewAccountInfoPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalLoginReviewAccountInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the token from the query params', () => {
    expect(component.token).toEqual('1234567890');
  });

  it('should display review account info component when there are no errors', () => {
    component.hasErrors = false;
    component.registrationData$ = of(mockRegistrationDataModel);
    fixture.detectChanges();
    const reviewAccountInfoComponent = fixture.nativeElement.querySelector('ds-review-account-info');
    expect(reviewAccountInfoComponent).toBeTruthy();
  });

  it('should display error alert when there are errors', () => {
    component.hasErrors = true;
    fixture.detectChanges();
    const errorAlertComponent = fixture.nativeElement.querySelector('ds-alert');
    expect(errorAlertComponent).toBeTruthy();
  });
});
