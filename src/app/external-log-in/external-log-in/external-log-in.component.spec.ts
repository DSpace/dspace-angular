import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLogInComponent } from './external-log-in.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { EventEmitter, Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of as observableOf } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../core/auth/auth.service';
import { AuthRegistrationType } from '../../core/auth/models/auth.registration-type';
import { MetadataValue } from '../../core/shared/metadata.models';
import { Registration } from '../../core/shared/registration.model';
import { AuthServiceMock } from '../../shared/mocks/auth.service.mock';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { BrowserOnlyMockPipe } from '../../shared/testing/browser-only-mock.pipe';
import { OrcidConfirmationComponent } from '../registration-types/orcid-confirmation/orcid-confirmation.component';

describe('ExternalLogInComponent', () => {
  let component: ExternalLogInComponent;
  let fixture: ComponentFixture<ExternalLogInComponent>;
  let modalService: NgbModal = jasmine.createSpyObj('modalService', ['open']);

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
    }
  };
  const translateServiceStub = {
    get: () => observableOf('Info Text'),
    instant(key) {
      return 'Info Text';
    },
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExternalLogInComponent, BrowserOnlyMockPipe, ],
      providers: [
        { provide: TranslateService, useValue: translateServiceStub },
        { provide: Injector, useValue: {} },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: NgbModal, useValue: modalService },
        FormBuilder
      ],
      imports: [
        CommonModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    TestBed.overrideComponent(OrcidConfirmationComponent, {
      set: {
        template: '<div>Mocked OrcidConfirmationComponent</div>',
      },
    });
    fixture = TestBed.createComponent(ExternalLogInComponent);
    component = fixture.componentInstance;
    component.registrationData = Object.assign(new Registration, registrationDataMock);
    component.registrationType = registrationDataMock.registrationType;
    fixture.detectChanges();
  });

  it('should create', () => {
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
    const button = fixture.nativeElement.querySelector('button.btn-primary');
    button.click();
    expect(modalService.open).toHaveBeenCalled();
  });

  it('should render the template with the translated informationText', () => {
    component.informationText = 'Info Text';
    fixture.detectChanges();
    const infoText = fixture.debugElement.query(By.css('[data-test="info-text"]'));
    expect(infoText.nativeElement.innerHTML).toContain('Info Text');
  });
});
