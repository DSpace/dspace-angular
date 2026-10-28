import {
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { authReducer } from '@dspace/core/auth/auth.reducer';
import { AuthService } from '@dspace/core/auth/auth.service';
import { AuthMethod } from '@dspace/core/auth/models/auth.method';
import { AuthMethodType } from '@dspace/core/auth/models/auth.method-type';
import { AuthRegistrationType } from '@dspace/core/auth/models/auth.registration-type';
import { MetadataValue } from '@dspace/core/shared/metadata.models';
import { Registration } from '@dspace/core/shared/registration.model';
import { AuthServiceMock } from '@dspace/core/testing/auth.service.mock';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { storeModuleConfig } from '../../app.reducer';
import { AlertComponent } from '../../shared/alert/alert.component';
import { ThemedLogInComponent } from '../../shared/log-in/themed-log-in.component';
import { getMockThemeService } from '../../shared/theme-support/test/theme-service.mock';
import { ThemeService } from '../../shared/theme-support/theme.service';
import { ConfirmEmailComponent } from '../email-confirmation/confirm-email/confirm-email.component';
import { ProvideEmailComponent } from '../email-confirmation/provide-email/provide-email.component';
import { ExternalLogInComponent } from './external-log-in.component';

describe('ExternalLogInComponent', () => {
  let component: ExternalLogInComponent;
  let fixture: ComponentFixture<ExternalLogInComponent>;
  let modalRef = Object.defineProperty({
    close: jasmine.createSpy('close'),
  },
  'dismissed', {
    get: () => of(),
  });
  let modalService = jasmine.createSpyObj('modalService', ['open']);
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
    onFallbackLangChange: new EventEmitter(),
  };

  beforeEach(async () => {
    modalService.open.and.returnValue(modalRef);

    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ExternalLogInComponent,
        StoreModule.forRoot(authReducer, storeModuleConfig),
      ],
      providers: [
        { provide: TranslateService, useValue: translateServiceStub },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: NgbModal, useValue: modalService },
        provideMockStore({ initialState }),
        { provide: ThemeService, useValue: getMockThemeService() },
      ],
    }).overrideComponent(ExternalLogInComponent, {
      add: {
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      },
      remove: {
        imports: [
          ConfirmEmailComponent,
          ProvideEmailComponent,
          AlertComponent,
          ThemedLogInComponent,
        ],
      },
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalLogInComponent);
    component = fixture.componentInstance;
    component.registrationData = Object.assign(new Registration(), registrationDataMock, { email: 'user@institution.edu' });
    component.registrationType = registrationDataMock.registrationType;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
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


