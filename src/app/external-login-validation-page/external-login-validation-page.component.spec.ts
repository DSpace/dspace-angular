import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLoginValidationPageComponent } from './external-login-validation-page.component';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { Observable, of } from 'rxjs';
import { RemoteData } from '../core/data/remote-data';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AlertType } from '../shared/alert/aletr-type';
import { tr } from 'date-fns/locale';

describe('ExternalLoginValidationPageComponent', () => {
  let component: ExternalLoginValidationPageComponent;
  let componentAsAny: any;
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
    },
    data: of({
      createUser: true,
    }),
  };

  beforeEach(async () => {
    epersonRegistrationService = {
      searchByTokenAndUpdateData: (token: string): Observable<RemoteData<any>> => { return createSuccessfulRemoteDataObject$(registrationDataMock); }
    };

    await TestBed.configureTestingModule({
      declarations: [ExternalLoginValidationPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
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
    componentAsAny = component;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set validationFailed to true if createUser is falsy', () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    activatedRoute.data = of({ createUser: false });
    component.ngOnInit();
    expect(componentAsAny.validationFailed.value).toBeTrue();
  });

  it('should set validationFailed to false if createUser is truthy', () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    activatedRoute.data = of({ createUser: true });
    component.ngOnInit();
    expect(componentAsAny.validationFailed.value).toBeFalse();
  });

  it('should show DsEmailValidatedComponent when hasFailed() returns false', () => {
    spyOn(component, 'hasFailed').and.returnValue(of(false));
    fixture.detectChanges();
    const dsEmailValidated = fixture.nativeElement.querySelector('ds-email-validated');
    expect(dsEmailValidated).toBeTruthy();
  });

  it('should show DsAlertComponent when hasFailed() returns true', () => {
    spyOn(component, 'hasFailed').and.returnValue(of(true));
    fixture.detectChanges();
    const dsAlert = fixture.nativeElement.querySelector('ds-alert');
    expect(dsAlert).toBeTruthy();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
