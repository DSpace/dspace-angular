import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';

import { MockTranslateLoader } from '../mocks/mock-translate-loader';

import { LoadingComponent } from './loading.component';

describe('LoadingComponent (inline template)', () => {

  let comp: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
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
      declarations: [LoadingComponent], // declare the test component
      providers: [TranslateService]
    }).compileComponents();  // compile template and css
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingComponent);

    comp = fixture.componentInstance; // LoadingComponent test instance
    comp.message = 'test message';
    fixture.detectChanges();
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
