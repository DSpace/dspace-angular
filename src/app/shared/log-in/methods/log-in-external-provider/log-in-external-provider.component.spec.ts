import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { authReducer } from '@dspace/core/auth/auth.reducer';
import { AuthService } from '@dspace/core/auth/auth.service';
import { AuthMethod } from '@dspace/core/auth/models/auth.method';
import { AuthMethodType } from '@dspace/core/auth/models/auth.method-type';
import { HardRedirectService } from '@dspace/core/services/hard-redirect.service';
import { NativeWindowService } from '@dspace/core/services/window.service';
import { ActivatedRouteStub } from '@dspace/core/testing/active-router.stub';
import { AuthServiceStub } from '@dspace/core/testing/auth-service.stub';
import { NativeWindowMockFactory } from '@dspace/core/testing/mock-native-window-ref';
import { RouterStub } from '@dspace/core/testing/router.stub';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';

import { storeModuleConfig } from '../../../../app.reducer';
import { LogInExternalProviderComponent } from './log-in-external-provider.component';

describe('LogInExternalProviderComponent', () => {

  let component: LogInExternalProviderComponent;
  let fixture: ComponentFixture<LogInExternalProviderComponent>;
  let componentAsAny: any;
  let setHrefSpy;
  let orcidBaseUrl: string;
  let location: string;
  let initialState: any;
  let hardRedirectService: HardRedirectService;

  beforeEach(() => {
    orcidBaseUrl = 'dspace-rest.test/orcid?redirectUrl=';
    location = orcidBaseUrl + 'http://dspace-angular.test/home';

    hardRedirectService = jasmine.createSpyObj('hardRedirectService', {
      getCurrentRoute: {},
      redirect: {},
    });

    initialState = {
      core: {
        auth: {
          authenticated: false,
          loaded: false,
          blocking: false,
          loading: false,
          authMethods: [],
        },
      },
    };
  });

  beforeEach(waitForAsync(() => {
    // refine the test module by declaring the test component
    void TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ auth: authReducer }, storeModuleConfig),
        TranslateModule.forRoot(),
        LogInExternalProviderComponent,
      ],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: 'authMethodProvider', useValue: new AuthMethod(AuthMethodType.Orcid, 0, location) },
        { provide: 'isStandalonePage', useValue: true },
        { provide: NativeWindowService, useFactory: NativeWindowMockFactory },
        { provide: Router, useValue: new RouterStub() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: HardRedirectService, useValue: hardRedirectService },
        provideMockStore({ initialState }),
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ],
    })
      .compileComponents();

  }));

  beforeEach(() => {
    // create component and test fixture
    fixture = TestBed.createComponent(LogInExternalProviderComponent);

    // get test component from the fixture
    component = fixture.componentInstance;
    componentAsAny = component;

    // create page
    setHrefSpy = spyOnProperty(componentAsAny._window.nativeWindow.location, 'href', 'set').and.callThrough();

  });

  it('should set the properly a new redirectUrl', () => {
    const currentUrl = 'http://dspace-angular.test/collections/12345';
    componentAsAny._window.nativeWindow.location.href = currentUrl;

    fixture.detectChanges();

    expect(componentAsAny.injectedAuthMethodModel.location).toBe(location);
    expect(componentAsAny._window.nativeWindow.location.href).toBe(currentUrl);

    component.redirectToExternalProvider();

    expect(hardRedirectService.redirect).toHaveBeenCalled();
  });

  it('should not set a new redirectUrl', () => {
    const currentUrl = 'http://dspace-angular.test/home';
    componentAsAny._window.nativeWindow.location.href = currentUrl;

    fixture.detectChanges();

    expect(componentAsAny.injectedAuthMethodModel.location).toBe(location);
    expect(componentAsAny._window.nativeWindow.location.href).toBe(currentUrl);

    component.redirectToExternalProvider();

    expect(setHrefSpy).toHaveBeenCalledWith(currentUrl);

  });

});
