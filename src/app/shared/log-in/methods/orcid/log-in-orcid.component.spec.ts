import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { provideMockStore } from '@ngrx/store/testing';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { EPerson } from '../../../../core/eperson/models/eperson.model';
import { EPersonMock } from '../../../testing/eperson.mock';
import { authReducer } from '../../../../core/auth/auth.reducer';
import { AuthService } from '../../../../core/auth/auth.service';
import { AuthServiceStub } from '../../../testing/auth-service.stub';
import { storeModuleConfig } from '../../../../app.reducer';
import { AuthMethod } from '../../../../core/auth/models/auth.method';
import { AuthMethodType } from '../../../../core/auth/models/auth.method-type';
import { LogInOrcidComponent } from './log-in-orcid.component';
import { NativeWindowService } from '../../../../core/services/window.service';
import { RouterStub } from '../../../testing/router.stub';
import { ActivatedRouteStub } from '../../../testing/active-router.stub';
import { NativeWindowMockFactory } from '../../../mocks/mock-native-window-ref';
import { HardRedirectService } from '../../../../core/services/hard-redirect.service';


describe('LogInOrcidComponent', () => {

  let component: LogInOrcidComponent;
  let fixture: ComponentFixture<LogInOrcidComponent>;
  let page: Page;
  let user: EPerson;
  let componentAsAny: any;
  let setHrefSpy;
  let orcidBaseUrl;
  let location;
  let initialState: any;
  let hardRedirectService: HardRedirectService;

  beforeEach(() => {
    user = EPersonMock;
    orcidBaseUrl = 'dspace-rest.test/orcid?redirectUrl=';
    location = orcidBaseUrl + 'http://dspace-angular.test/home';

    hardRedirectService = jasmine.createSpyObj('hardRedirectService', {
      getCurrentRoute: {},
      redirect: {}
    });

    initialState = {
      core: {
        auth: {
          authenticated: false,
          loaded: false,
          blocking: false,
          loading: false,
          authMethods: []
        }
      }
    };
  });

  beforeEach(waitForAsync(() => {
    // refine the test module by declaring the test component
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ auth: authReducer }, storeModuleConfig),
        TranslateModule.forRoot()
      ],
      declarations: [
        LogInOrcidComponent
      ],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: 'authMethodProvider', useValue: new AuthMethod(AuthMethodType.Orcid, location) },
        { provide: 'isStandalonePage', useValue: true },
        { provide: NativeWindowService, useFactory: NativeWindowMockFactory },
        { provide: Router, useValue: new RouterStub() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: HardRedirectService, useValue: hardRedirectService },
        provideMockStore({ initialState }),
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();

  }));

  beforeEach(() => {
    // create component and test fixture
    fixture = TestBed.createComponent(LogInOrcidComponent);

    // get test component from the fixture
    component = fixture.componentInstance;
    componentAsAny = component;

    // create page
    page = new Page(component, fixture);
    setHrefSpy = spyOnProperty(componentAsAny._window.nativeWindow.location, 'href', 'set').and.callThrough();

  });

  it('should set the properly a new redirectUrl', () => {
    const currentUrl = 'http://dspace-angular.test/collections/12345';
    componentAsAny._window.nativeWindow.location.href = currentUrl;

    fixture.detectChanges();

    expect(componentAsAny.injectedAuthMethodModel.location).toBe(location);
    expect(componentAsAny._window.nativeWindow.location.href).toBe(currentUrl);

    component.redirectToOrcid();

    expect(setHrefSpy).toHaveBeenCalledWith(currentUrl);

  });

  it('should not set a new redirectUrl', () => {
    const currentUrl = 'http://dspace-angular.test/home';
    componentAsAny._window.nativeWindow.location.href = currentUrl;

    fixture.detectChanges();

    expect(componentAsAny.injectedAuthMethodModel.location).toBe(location);
    expect(componentAsAny._window.nativeWindow.location.href).toBe(currentUrl);

    component.redirectToOrcid();

    expect(setHrefSpy).toHaveBeenCalledWith(currentUrl);

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

  constructor(private component: LogInOrcidComponent, private fixture: ComponentFixture<LogInOrcidComponent>) {
    // use injector to get services
    const injector = fixture.debugElement.injector;
    const store = injector.get(Store);

    // add spies
    this.navigateSpy = spyOn(store, 'dispatch');
  }

}
