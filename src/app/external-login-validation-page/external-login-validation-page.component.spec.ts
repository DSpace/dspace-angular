import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLoginValidationPageComponent } from './external-login-validation-page.component';
import { EpersonRegistrationService } from '../core/data/eperson-registration.service';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { Observable, of } from 'rxjs';
import { RemoteData } from '../core/data/remote-data';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RegistrationData } from '../shared/external-log-in-complete/models/registration-data.model';
import { AlertType } from '../shared/alert/aletr-type';

describe('ExternalLoginValidationPageComponent', () => {
  let component: ExternalLoginValidationPageComponent;
  let fixture: ComponentFixture<ExternalLoginValidationPageComponent>;
  let epersonRegistrationService: any;

  const registrationDataMock = {
    registrationType: 'orcid',
    email: 'test@test.com',
    netId: '0000-0000-0000-0000',
    user: 'a44d8c9e-9b1f-4e7f-9b1a-5c9d8a0b1f1a',
    registrationMetadata: {
      'email': [{ value: 'test@test.com' }],
      'eperson.lastname': [{ value: 'Doe' }],
      'eperson.firstname': [{ value: 'John' }],
    },
  };

  const tokenMock = 'as552-5a5a5-5a5a5-5a5a5';

  const routeStub = {
    snapshot: {
      queryParams: {
        token: tokenMock
      }
    }
  };

  beforeEach(async () => {
    epersonRegistrationService = {
      searchByToken: (token: string): Observable<RemoteData<any>> => { return createSuccessfulRemoteDataObject$(registrationDataMock); }
    };

    await TestBed.configureTestingModule({
      declarations: [ExternalLoginValidationPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: EpersonRegistrationService, useValue: epersonRegistrationService },
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
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalLoginValidationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the token from the query parameters', () => {
    expect(component.token).toEqual(tokenMock);
  });

  it('should initialize the registration data', () => {
    spyOn(epersonRegistrationService, 'searchByToken').and.callThrough();
    component.ngOnInit();
    expect(epersonRegistrationService.searchByToken).toHaveBeenCalledWith(tokenMock);
    expect(component.registrationData$).toBeTruthy();
  });

  it('should render ds-email-validated component when registrationData$ does not have an email', () => {
    component.registrationData$ = of(Object.assign(new RegistrationData(), { registrationDataMock, email: null }));
    component.ngOnInit();
    fixture.detectChanges();

    const emailValidatedComponent = fixture.nativeElement.querySelector('ds-email-validated');
    const reviewAccountInfoComponent = fixture.nativeElement.querySelector('ds-review-account-info');

    expect(emailValidatedComponent).toBeTruthy();
    expect(reviewAccountInfoComponent).toBeNull();
  });

  it('should render ds-review-account-info component when registrationData$ has an email', () => {
    component.registrationData$ = of(Object.assign(new RegistrationData(), { registrationDataMock, email: 'hey@hello.com' }));
    // component.ngOnInit();
    fixture.detectChanges();
    const emailValidatedComponent = fixture.nativeElement.querySelector('ds-email-validated');
    const reviewAccountInfoComponent = fixture.nativeElement.querySelector('ds-review-account-info');

    expect(emailValidatedComponent).toBeNull();
    expect(reviewAccountInfoComponent).toBeTruthy();
  });

  it('should render ds-alert component when token is missing', () => {
    component.token = null;
    component.ngOnInit();
    fixture.detectChanges();

    const alertComponent = fixture.nativeElement.querySelector('ds-alert');

    expect(alertComponent).toBeTruthy();
    expect(component.AlertTypeEnum).toEqual(AlertType);
  });

  afterEach(() => {
    fixture.destroy();
  });
});
