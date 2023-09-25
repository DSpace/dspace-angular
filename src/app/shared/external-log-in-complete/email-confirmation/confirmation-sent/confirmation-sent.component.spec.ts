import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationSentComponent } from './confirmation-sent.component';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../shared/mocks/translate-loader.mock';

describe('ConfirmationSentComponent', () => {
  let component: ConfirmationSentComponent;
  let fixture: ComponentFixture<ConfirmationSentComponent>;
  let compiledTemplate: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmationSentComponent ],
      providers: [
        { provide: TranslateService, useClass: {} },
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
    expect(headerElement.textContent).toContain('Mocked Header Translation');
  });

  it('should render translated info paragraph', () => {
    const infoParagraphElement = compiledTemplate.querySelector('p');
    expect(infoParagraphElement.innerHTML).toContain('Mocked Info Translation');
  });

});
