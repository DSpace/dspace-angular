import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { storeModuleConfig } from '../../app.reducer';
import { authReducer } from '../../core/auth/auth.reducer';
import { AuthService } from '../../core/auth/auth.service';
import { AuthMethodsService } from '../../core/auth/auth-methods.service';
import { AuthMethod } from '../../core/auth/models/auth.method';
import { AuthMethodType } from '../../core/auth/models/auth.method-type';
import { AuthRegistrationType } from '../../core/auth/models/auth.registration-type';
import { MetadataValue } from '../../core/shared/metadata.models';
import { Registration } from '../../core/shared/registration.model';
import { AuthMethodTypeComponent } from '../../shared/log-in/methods/auth-methods.type';
import { AuthServiceMock } from '../../shared/mocks/auth.service.mock';
import { BrowserOnlyPipe } from '../../shared/utils/browser-only.pipe';
import { ConfirmEmailComponent } from '../email-confirmation/confirm-email/confirm-email.component';
import { OrcidConfirmationComponent } from '../registration-types/orcid-confirmation/orcid-confirmation.component';
import { ExternalLogInComponent } from './external-log-in.component';

describe('ExternalLogInComponent', () => {
  let component: ExternalLogInComponent;
  let fixture: ComponentFixture<ExternalLogInComponent>;
  let modalService: NgbModal = jasmine.createSpyObj('modalService', ['open']);
  let authServiceStub: jasmine.SpyObj<AuthService>;
  let authMethodsServiceStub: jasmine.SpyObj<AuthMethodsService>;
  let mockAuthMethodsArray: AuthMethod[] = [
    { id: 'password', authMethodType: AuthMethodType.Password, position: 2 } as AuthMethod,
    { id: 'shibboleth', authMethodType: AuthMethodType.Shibboleth, position: 1 } as AuthMethod,
    { id: 'oidc', authMethodType: AuthMethodType.Oidc, position: 3 } as AuthMethod,
    { id: 'ip', authMethodType: AuthMethodType.Ip, position: 4 } as AuthMethod,
  ];

  const initialState = {
    core: {
      auth: {
        authMethods: mockAuthMethodsArray,
      },
    },
  };

  const registrationDataMock = {
    id: '3',
    email: 'user@institution.edu',
    user: '028dcbb8-0da2-4122-a0ea-254be49ca107',
    registrationType: AuthRegistrationType.Orcid,
    netId: '0000-1111-2222-3333',
    registrationMetadata: {
      'eperson.firstname': [
        Object.assign(new MetadataValue(), {
          value: 'User 1',
          language: null,
          authority: '',
          confidence: -1,
          place: -1,
        }),
      ],
    },
  };
  const translateServiceStub = {
    get: () => of('Info Text'),
    instant: (key: any) => 'Info Text',
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter(),
  };

  beforeEach(async () => {
    authServiceStub = jasmine.createSpyObj('AuthService', ['getAuthenticationMethods']);
    authMethodsServiceStub = jasmine.createSpyObj('AuthMethodsService', ['getAuthMethods']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TranslateModule.forRoot({}),
        BrowserOnlyPipe,
        ExternalLogInComponent,
        OrcidConfirmationComponent,
        BrowserAnimationsModule,
        StoreModule.forRoot(authReducer, storeModuleConfig),
      ],
      providers: [
        { provide: TranslateService, useValue: translateServiceStub },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: NgbModal, useValue: modalService },
        FormBuilder,
        provideMockStore({ initialState }),
      ],
    })
      .overrideComponent(ExternalLogInComponent, {
        remove: {
          imports: [ConfirmEmailComponent],
        },
      })
      .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalLogInComponent);
    component = fixture.componentInstance;
    component.registrationData = Object.assign(new Registration(), registrationDataMock);
    component.registrationType = registrationDataMock.registrationType;

    let mockAuthMethods = new Map<AuthMethodType, AuthMethodTypeComponent>();
    mockAuthMethods.set(AuthMethodType.Password, {} as AuthMethodTypeComponent);
    mockAuthMethods.set(AuthMethodType.Shibboleth, {} as AuthMethodTypeComponent);
    mockAuthMethods.set(AuthMethodType.Oidc, {} as AuthMethodTypeComponent);
    mockAuthMethods.set(AuthMethodType.Ip, {} as AuthMethodTypeComponent);
    component.authMethods = mockAuthMethods;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  beforeEach(() => {
    component.registrationData = Object.assign(new Registration(), registrationDataMock, { email: 'user@institution.edu' });

    fixture.detectChanges();
  });

  it('should set registrationType and informationText correctly when email is present', () => {
    expect(component.registrationType).toBe(registrationDataMock.registrationType);
    expect(component.informationText).toBeDefined();
  });

  it('should render the template to confirm email when registrationData has email', () => {
    const selector = fixture.nativeElement.querySelector('ds-confirm-email');
    const provideEmail = fixture.nativeElement.querySelector('ds-provide-email');
    expect(selector).toBeTruthy();
    expect(provideEmail).toBeNull();
  });

  it('should display login modal when connect to existing account button is clicked', () => {
    const button = fixture.debugElement.query(By.css('[data-test="open-modal"]'));

    expect(button).not.toBeNull('Connect to existing account button should be in the DOM');

    button.nativeElement.click();
    expect(modalService.open).toHaveBeenCalled();
  });

  it('should render the template with the translated informationText', () => {
    component.informationText = 'Info Text';
    fixture.detectChanges();
    const infoText = fixture.debugElement.query(By.css('[data-test="info-text"]'));
    expect(infoText.nativeElement.innerHTML).toContain('Info Text');
  });
});


