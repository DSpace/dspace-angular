import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLogInComponent } from './external-log-in.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { EventEmitter, Injector } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of as observableOf } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthServiceMock } from '../../mocks/auth.service.mock';
import { MetadataValue } from '../../../core/shared/metadata.models';
import { AuthMethodType } from '../../../core/auth/models/auth.method-type';
import { RegistrationData } from '../models/registration-data.model';

describe('ExternalLogInComponent', () => {
  let component: ExternalLogInComponent;
  let fixture: ComponentFixture<ExternalLogInComponent>;
  let compiledTemplate: HTMLElement;

  const registrationDataMock = {
    id: '3',
    email: 'user@institution.edu',
    user: '028dcbb8-0da2-4122-a0ea-254be49ca107',
    registrationType: AuthMethodType.Orcid,
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
    instant: (key: any) => 'Info Text',
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExternalLogInComponent],
      providers: [
        { provide: TranslateService, useValue: translateServiceStub },
        { provide: Injector, useValue: {} },
        { provide: AuthService, useValue: new AuthServiceMock() },
        {
          provide: NgbModal, useValue: {
            open: () => {
              /*comment*/
            }
          }
        },
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
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalLogInComponent);
    component = fixture.componentInstance;
    component.registrationData = Object.assign(new RegistrationData, registrationDataMock);
    component.registrationType = registrationDataMock.registrationType;
    compiledTemplate = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set registrationType and informationText correctly when email is present', () => {
    expect(component.registrationType).toBe(registrationDataMock.registrationType);
    expect(component.informationText).toBeDefined();
  });

  it('should render the template to confirm email when registrationData has email', () => {
    component.registrationData = Object.assign(new RegistrationData(), registrationDataMock, { email: 'email@domain.com' });
    fixture.detectChanges();
    const selector = compiledTemplate.querySelector('ds-confirm-email');
    expect(selector).toBeTruthy();
  });

  it('should display provide email component if email is not provided', () => {
    component.registrationData.email = null;
    fixture.detectChanges();
    const provideEmail = fixture.nativeElement.querySelector('ds-provide-email');
    expect(provideEmail).toBeTruthy();
  });

  it('should display login modal when connect to existing account button is clicked', () => {
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    const modal = fixture.nativeElement.querySelector('.modal');
    expect(modal).toBeTruthy();
  });

  it('should render the template with the translated informationText', () => {
    component.informationText = 'Info Text';
    fixture.detectChanges();
    const infoText = fixture.debugElement.query(By.css('[data-test="info-text"]'));
    expect(infoText.nativeElement.innerHTML).toContain('Info Text');
  });
});


