import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';

import { LogInComponent } from './log-in.component';
import { authReducer } from '../../core/auth/auth.reducer';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '../../core/auth/auth.service';
import { authMethodsMock, AuthServiceStub } from '../testing/auth-service.stub';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared.module';
import { NativeWindowMockFactory } from '../mocks/mock-native-window-ref';
import { ActivatedRouteStub } from '../testing/active-router.stub';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeWindowService } from '../../core/services/window.service';
import { provideMockStore } from '@ngrx/store/testing';
import { createTestComponent } from '../testing/utils.test';
import { RouterTestingModule } from '@angular/router/testing';
import { HardRedirectService } from '../../core/services/hard-redirect.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { of } from 'rxjs';
import { ThemeService } from '../theme-support/theme.service';
import { getMockThemeService } from '../mocks/theme-service.mock';
import { of as observableOf } from 'rxjs';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { ConfigurationProperty } from '../../core/shared/configuration-property.model';
import { RouterStub } from '../testing/router.stub';

describe('LogInComponent', () => {

  let component: LogInComponent;
  let fixture: ComponentFixture<LogInComponent>;
  const initialState = {
    core: {
      auth: {
        authenticated: false,
        loaded: false,
        loading: false,
        authMethods: authMethodsMock
      }
    }
  };
  let hardRedirectService: HardRedirectService;

  let authorizationService: AuthorizationDataService;
  let authService: any;
  let configurationDataService: ConfigurationDataService;

  beforeEach(waitForAsync(() => {
    hardRedirectService = jasmine.createSpyObj('hardRedirectService', {
      redirect: {},
      getCurrentRoute: {}
    });
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: of(true)
    });
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: observableOf(true),
      setRedirectUrl: {},
      setRedirectUrlIfNotSet: {}
    });
    configurationDataService = jasmine.createSpyObj('configurationDataService', {
      findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
        name: 'dspace.ui.url',
        values: [
          'some url'
        ]
      }))
    });

    // refine the test module by declaring the test component
    void TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot(authReducer, {
          runtimeChecks: {
            strictStateImmutability: false,
            strictActionImmutability: false
          }
        }),
        RouterTestingModule,
        SharedModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        TestComponent
      ],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: NativeWindowService, useFactory: NativeWindowMockFactory },
        { provide: Router, useValue: new RouterStub() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: HardRedirectService, useValue: hardRedirectService },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: ConfigurationDataService, useValue: configurationDataService },
        provideMockStore({ initialState }),
        { provide: ThemeService, useValue: getMockThemeService() },
        LogInComponent
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();

  }));

  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      const html = `<ds-themed-log-in [isStandalonePage]="isStandalonePage"> </ds-themed-log-in>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create LogInComponent', inject([LogInComponent], (app: LogInComponent) => {

      expect(app).toBeDefined();

    }));
  });

  describe('', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(LogInComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    afterEach(() => {
      fixture.destroy();
      component = null;
    });

    it('should render a log-in container component for each auth method available', () => {
      const loginContainers = fixture.debugElement.queryAll(By.css('ds-log-in-container'));
      expect(loginContainers.length).toBe(2);

    });
  });

});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

  isStandalonePage = true;

}
