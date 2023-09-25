import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailValidatedComponent } from './email-validated.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoaderMock } from '../../../../shared/mocks/translate-loader.mock';
import { BehaviorSubject } from 'rxjs';
import { getMockTranslateService } from '../../../../shared/mocks/translate.service.mock';

describe('EmailValidatedComponent', () => {
  let component: EmailValidatedComponent;
  let fixture: ComponentFixture<EmailValidatedComponent>;
  let compiledTemplate: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailValidatedComponent ],
      providers: [
        { provide: TranslateService, useValue: getMockTranslateService() },
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
    expect(headerElement.textContent).toContain('Mocked Header Translation');
  });

  it('should render translated info paragraph', () => {
    const infoParagraphElement = compiledTemplate.querySelector('p');
    expect(infoParagraphElement.innerHTML).toContain('Mocked Info Translation');
  });

  it('should render ds-log-in component', () => {
    const dsLogInComponent = compiledTemplate.querySelector('ds-log-in');
    expect(dsLogInComponent).toBeTruthy();
  });

});

// Mock the TranslateService
class MockTranslateService {
  private translationSubject = new BehaviorSubject<any>({});

  get(key: string) {
    const translations = {
      'external-login.validated-email.header': 'Mocked Header Translation',
      'external-login.validated-email.info': 'Mocked Info Translation',
    };

    this.translationSubject.next(translations);

    // Return an Observable that mimics TranslateService's behavior
    return this.translationSubject.asObservable();
  }
}
