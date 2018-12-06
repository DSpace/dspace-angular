import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { ErrorComponent } from './error.component';
import { MockTranslateLoader } from '../mocks/mock-translate-loader';

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
            useClass: MockTranslateLoader
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
