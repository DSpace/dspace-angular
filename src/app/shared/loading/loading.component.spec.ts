import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { TranslateLoaderMock } from '../mocks/translate-loader.mock';
import { LoadingComponent } from './loading.component';

describe('LoadingComponent (inline template)', () => {

  let comp: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'fake-url',
            redirectTo: '/',
          },
        ]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
      ],
      declarations: [LoadingComponent], // declare the test component
    }).compileComponents();  // compile template and css

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingComponent);

    comp = fixture.componentInstance; // LoadingComponent test instance
    comp.message = 'test message';
    comp.warningMessage = 'test warning message';
    comp.errorMessage = 'test error message';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should display default message', () => {
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('label'));
    el = de.nativeElement;
    expect(el.textContent).toContain(comp.message);
  });

  it('should display input message', () => {
    comp.message = 'Test Message';
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('label'));
    el = de.nativeElement;
    expect(el.textContent).toContain('Test Message');
  });

  it('should display warning message when MessageType WARNING is set as messageToShow', () => {
    comp.messageToShow = comp.MessageType.WARNING;
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('label'));
    el = de.nativeElement;
    expect(el.textContent).toContain(comp.warningMessage);
  });

  it('should display ds-alert when MessageType ERROR is set as messageToShow', () => {
    comp.messageToShow = comp.MessageType.ERROR;
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('ds-alert'));
    expect(de).toBeTruthy();
  });

  it('should add time if the page has been automatically reloaded', () => {
    comp.pageReloadCount = 1;
    comp.errorMessageDelay = 1000;
    comp.warningMessageDelay = 500;
    comp.numberOfAutomaticPageReloads = 2;
    comp.ngOnInit();

    expect(comp.errorTimeoutWithRetriesDelay).toBe(1500);
  });

});
