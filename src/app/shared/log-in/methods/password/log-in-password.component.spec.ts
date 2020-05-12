import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { By } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { LogInPasswordComponent } from './log-in-password.component';
import { EPerson } from '../../../../core/eperson/models/eperson.model';
import { EPersonMock } from '../../../testing/eperson.mock';
import { authReducer } from '../../../../core/auth/auth.reducer';
import { AuthService } from '../../../../core/auth/auth.service';
import { AuthServiceStub } from '../../../testing/auth-service.stub';
import { AppState } from '../../../../app.reducer';
import { AuthMethod } from '../../../../core/auth/models/auth.method';
import { AuthMethodType } from '../../../../core/auth/models/auth.method-type';

describe('LogInPasswordComponent', () => {

  let component: LogInPasswordComponent;
  let fixture: ComponentFixture<LogInPasswordComponent>;
  let page: Page;
  let user: EPerson;

  const authState = {
    authenticated: false,
    loaded: false,
    loading: false,
  };

  beforeEach(() => {
    user = EPersonMock;
  });

  beforeEach(async(() => {
    // refine the test module by declaring the test component
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot(authReducer),
        TranslateModule.forRoot()
      ],
      declarations: [
        LogInPasswordComponent
      ],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: 'authMethodProvider', useValue: new AuthMethod(AuthMethodType.Password) }
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();

  }));

  beforeEach(inject([Store], (store: Store<AppState>) => {
    store
      .subscribe((state) => {
        (state as any).core = Object.create({});
        (state as any).core.auth = authState;
      });

    // create component and test fixture
    fixture = TestBed.createComponent(LogInPasswordComponent);

    // get test component from the fixture
    component = fixture.componentInstance;

    // create page
    page = new Page(component, fixture);

    // verify the fixture is stable (no pending tasks)
    fixture.whenStable().then(() => {
      page.addPageElements();
    });

  }));

  it('should create a FormGroup comprised of FormControls', () => {
    fixture.detectChanges();
    expect(component.form instanceof FormGroup).toBe(true);
  });

  it('should authenticate', () => {
    fixture.detectChanges();

    // set FormControl values
    component.form.controls.email.setValue('user');
    component.form.controls.password.setValue('password');

    // submit form
    component.submit();

    // verify Store.dispatch() is invoked
    expect(page.navigateSpy.calls.any()).toBe(true, 'Store.dispatch not invoked');
  });

});

/**
 * I represent the DOM elements and attach spies.
 *
 * @class Page
 */
class Page {

  public emailInput: HTMLInputElement;
  public navigateSpy: jasmine.Spy;
  public passwordInput: HTMLInputElement;

  constructor(private component: LogInPasswordComponent, private fixture: ComponentFixture<LogInPasswordComponent>) {
    // use injector to get services
    const injector = fixture.debugElement.injector;
    const store = injector.get(Store);

    // add spies
    this.navigateSpy = spyOn(store, 'dispatch');
  }

  public addPageElements() {
    const emailInputSelector = 'input[formcontrolname=\'email\']';
    this.emailInput = this.fixture.debugElement.query(By.css(emailInputSelector)).nativeElement;

    const passwordInputSelector = 'input[formcontrolname=\'password\']';
    this.passwordInput = this.fixture.debugElement.query(By.css(passwordInputSelector)).nativeElement;
  }
}
