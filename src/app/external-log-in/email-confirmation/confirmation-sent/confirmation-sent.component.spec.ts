import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { TranslateLoaderMock } from '../../../shared/mocks/translate-loader.mock';
import { ConfirmationSentComponent } from './confirmation-sent.component';

describe('ConfirmationSentComponent', () => {
  let component: ConfirmationSentComponent;
  let fixture: ComponentFixture<ConfirmationSentComponent>;
  let compiledTemplate: HTMLElement;

  const translateServiceStub = {
    get: () => of('Mocked Translation Text'),
    instant: (key: any) => 'Mocked Translation Text',
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateServiceStub },
      ],
      imports: [
        CommonModule,
        ConfirmationSentComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationSentComponent);
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
});
