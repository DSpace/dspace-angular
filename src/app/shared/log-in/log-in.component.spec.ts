import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { By } from '@angular/platform-browser';
import { Store, StoreModule, select } from '@ngrx/store';

import { LogInComponent } from './log-in.component';
import { authReducer } from '../../core/auth/auth.reducer';
import { EPersonMock } from '../testing/eperson-mock';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/auth/auth.service';
import { AuthServiceStub } from '../testing/auth-service-stub';
import { AppState } from '../../app.reducer';
import {AppRoutingModule} from '../../app-routing.module';
import {PageNotFoundComponent} from '../../pagenotfound/pagenotfound.component';
import {APP_BASE_HREF} from '@angular/common';
import {HostWindowService} from '../host-window.service';
import {HostWindowServiceStub} from '../testing/host-window-service-stub';
import {RouterStub} from '../testing/router-stub';
import {Router} from '@angular/router';
import {RouteService} from '../services/route.service';
import {routeServiceStub} from '../testing/route-service-stub';

describe('LogInComponent', () => {

  let component: LogInComponent;
  let fixture: ComponentFixture<LogInComponent>;
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
        AppRoutingModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        LogInComponent,
        PageNotFoundComponent
      ],
      providers: [
        {provide: AuthService, useClass: AuthServiceStub},
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: Router, useClass: RouterStub},
        {provide: RouteService, useValue: routeServiceStub },
        {provide: HostWindowService, useValue: new HostWindowServiceStub(900) }
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
    fixture = TestBed.createComponent(LogInComponent);

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

  it('should set the redirect url',  () => {
    fixture.detectChanges();

    // set FormControl values
    component.form.controls.email.setValue('user');
    component.form.controls.password.setValue('password');

    const authService: AuthService = TestBed.get(AuthService);
    spyOn(authService, 'setRedirectUrl');

    component.submit();

    // the redirect url should be set upon submit
    expect(authService.setRedirectUrl).toHaveBeenCalled();
  });

  it('should not set the redirect url to /login',  () => {
    fixture.detectChanges();

    const router: Router = TestBed.get(Router);
    router.navigateByUrl('/login')

    const authService: AuthService = TestBed.get(AuthService);

    // set FormControl values
    component.form.controls.email.setValue('user');
    component.form.controls.password.setValue('password');

    spyOn(authService, 'setRedirectUrl');

    component.submit();

    expect(authService.setRedirectUrl).not.toHaveBeenCalled();
  });

  it('should not set the redirect url on init',  () => {

    const authService: AuthService = TestBed.get(AuthService);
    spyOn(authService, 'setRedirectUrl');

    fixture.detectChanges();
    expect(authService.setRedirectUrl).not.toHaveBeenCalledWith();

  });

});

describe('LogInComponent on small screen', () => {

  let component: LogInComponent;
  let fixture: ComponentFixture<LogInComponent>;
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
        AppRoutingModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        LogInComponent,
        PageNotFoundComponent
      ],
      providers: [
        {provide: AuthService, useClass: AuthServiceStub},
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: Router, useClass: RouterStub},
        {provide: RouteService, useValue: routeServiceStub },
        {provide: HostWindowService, useValue: new HostWindowServiceStub(300) }
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
    fixture = TestBed.createComponent(LogInComponent);

    // get test component from the fixture
    component = fixture.componentInstance;

    // create page
    page = new Page(component, fixture);

    // verify the fixture is stable (no pending tasks)
    fixture.whenStable().then(() => {
      page.addPageElements();
    });

  }));

  it('should set the redirect url on init',  () => {
    const authService: AuthService = TestBed.get(AuthService);
    spyOn(authService, 'setRedirectUrl');
    fixture.detectChanges();
    // set FormControl values
    component.form.controls.email.setValue('user');
    component.form.controls.password.setValue('password');
    expect(authService.setRedirectUrl).toHaveBeenCalledWith('collection/123');

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

  constructor(private component: LogInComponent, private fixture: ComponentFixture<LogInComponent>) {
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
