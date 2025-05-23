import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { ConfirmationSentComponent } from '../external-log-in/email-confirmation/confirmation-sent/confirmation-sent.component';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { ExternalLoginEmailConfirmationPageComponent } from './external-login-email-confirmation-page.component';

describe('ExternalLoginEmailConfirmationPageComponent', () => {
  let component: ExternalLoginEmailConfirmationPageComponent;
  let fixture: ComponentFixture<ExternalLoginEmailConfirmationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        ExternalLoginEmailConfirmationPageComponent,
        ConfirmationSentComponent,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalLoginEmailConfirmationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render ConfirmationSentComponent', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('ds-confirmation-sent')).toBeTruthy();
  });
});
