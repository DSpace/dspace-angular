import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { authReducer } from '../../core/auth/auth.reducer';
import { AuthService } from '../../core/auth/auth.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { HardRedirectService } from '../../core/services/hard-redirect.service';
import { NativeWindowService } from '../../core/services/window.service';
import { NativeWindowMockFactory } from '../mocks/mock-native-window-ref';
import { getMockThemeService } from '../mocks/theme-service.mock';
import { ActivatedRouteStub } from '../testing/active-router.stub';
import {
  authMethodsMock,
  AuthServiceStub,
} from '../testing/auth-service.stub';
import { createTestComponent } from '../testing/utils.test';
import { ThemeService } from '../theme-support/theme.service';
import { LogInComponent } from './log-in.component';

describe('LogInComponent', () => {

  let component: LogInComponent;
  let fixture: ComponentFixture<LogInComponent>;
  const initialState = {
    core: {
      auth: {
        authenticated: false,
        loaded: false,
        loading: false,
        authMethods: authMethodsMock,
      },
    },
  };
  let hardRedirectService: HardRedirectService;

  let authorizationService: AuthorizationDataService;

  beforeEach(waitForAsync(() => {
    hardRedirectService = jasmine.createSpyObj('hardRedirectService', {
      redirect: {},
      getCurrentRoute: {},
    });
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: of(true),
    });

    // refine the test module by declaring the test component
    void TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot(authReducer, {
          runtimeChecks: {
            strictStateImmutability: false,
            strictActionImmutability: false,
          },
        }),
        RouterTestingModule,
        TranslateModule.forRoot(),
        TestComponent,
      ],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: NativeWindowService, useFactory: NativeWindowMockFactory },
        // { provide: Router, useValue: new RouterStub() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: HardRedirectService, useValue: hardRedirectService },
        { provide: AuthorizationDataService, useValue: authorizationService },
        provideMockStore({ initialState }),
        { provide: ThemeService, useValue: getMockThemeService() },
        LogInComponent,
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ],
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
  template: ``,
  standalone: true,
  imports: [FormsModule,
    ReactiveFormsModule,
    RouterTestingModule],
})
class TestComponent {

  isStandalonePage = true;

}
