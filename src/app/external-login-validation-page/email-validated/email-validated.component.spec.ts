import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailValidatedComponent } from './email-validated.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { TranslateLoaderMock } from 'src/app/shared/mocks/translate-loader.mock';

describe('EmailValidatedComponent', () => {
  let component: EmailValidatedComponent;
  let fixture: ComponentFixture<EmailValidatedComponent>;
  let compiledTemplate: HTMLElement;

  const translateServiceStub = {
    get: () => of('Mocked Translation Text'),
    instant: (key: any) => 'Mocked Translation Text',
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailValidatedComponent ],
      providers: [
        { provide: TranslateService, useValue: translateServiceStub },
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
    fixture = TestBed.createComponent(EmailValidatedComponent);
    component = fixture.componentInstance;
    compiledTemplate = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render translated header', () => {
    const headerElement = compiledTemplate.querySelector('h4');
    expect(headerElement.textContent).toContain('Mocked Translation Text');
  });

  it('should render translated info paragraph', () => {
    const infoParagraphElement = compiledTemplate.querySelector('p');
    expect(infoParagraphElement.innerHTML).toBeTruthy();
  });

  it('should render ds-log-in component', () => {
    const dsLogInComponent = compiledTemplate.querySelector('ds-log-in');
    expect(dsLogInComponent).toBeTruthy();
  });
});

