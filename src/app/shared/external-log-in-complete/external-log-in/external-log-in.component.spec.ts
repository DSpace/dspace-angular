import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLogInComponent } from './external-log-in.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Injector } from '@angular/core';
import { mockRegistrationDataModel } from '../models/registration-data.mock.model';
import { By } from '@angular/platform-browser';
import { of as observableOf } from 'rxjs';
import { FormBuilder } from '@angular/forms';

describe('ExternalLogInComponent', () => {
  let component: ExternalLogInComponent;
  let fixture: ComponentFixture<ExternalLogInComponent>;
  let compiledTemplate: HTMLElement;
  const translateServiceStub = {
    get: () => observableOf('Mocked Translation Text'),
    instant: (key: any) => 'Mocked Translation Text',
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
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalLogInComponent);
    component = fixture.componentInstance;
    component.registrationData = mockRegistrationDataModel;
    compiledTemplate = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set registrationType and informationText correctly when email is present', () => {
    expect(component.registrationType).toBe('orcid');
    expect(component.informationText).toContain('orcid');
  });

  it('should render the template to confirm email when registrationData has email', () => {
    const selector = compiledTemplate.querySelector('ds-confirm-email');
    expect(selector).toBeTruthy();
  });

  it('should render the template with provide email component when registrationData email is null', () => {
    component.registrationData.email = null;
    fixture.detectChanges();
    const provideEmailComponent = compiledTemplate.querySelector('ds-provide-email');
    expect(provideEmailComponent).toBeTruthy();
  });

  it('should render the template with log-in component', () => {
    const logInComponent = compiledTemplate.querySelector('ds-log-in');
    expect(logInComponent).toBeTruthy();
  });

  it('should render the template with the translated informationText', () => {
    component.informationText = 'Mocked Translation Text';
    fixture.detectChanges();
    const infoText = fixture.debugElement.query(By.css('[data-test="info-text"]'));
    expect(infoText.nativeElement.innerHTML).toContain('Mocked Translation Text');
  });
});


