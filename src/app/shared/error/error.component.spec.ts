import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';

import { TranslateLoaderMock } from '../mocks/translate-loader.mock';

import { ErrorComponent } from './error.component';

describe('ErrorComponent (inline template)', () => {

  let comp: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [ErrorComponent], // declare the test component
      providers: [TranslateService]
    }).compileComponents();  // compile template and css
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorComponent);

    comp = fixture.componentInstance; // ErrorComponent test instance

    // query for the message <label> by CSS element selector
    de = fixture.debugElement.query(By.css('label'));
    el = de.nativeElement;
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should display default message', () => {
    fixture.detectChanges();
    expect(el.textContent).toContain(comp.message);
  });

  it('should display input message', () => {
    comp.message = 'Test Message';
    fixture.detectChanges();
    expect(el.textContent).toContain('Test Message');
  });

});
