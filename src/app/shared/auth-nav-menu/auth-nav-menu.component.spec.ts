import {
  CUSTOM_ELEMENTS_SCHEMA,
  DebugElement,
} from '@angular/core';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import {
  authReducer,
  AuthState,
} from '@dspace/core/auth/auth.reducer';
import { AuthService } from '@dspace/core/auth/auth.service';
import { AuthTokenInfo } from '@dspace/core/auth/models/auth-token-info.model';
import { APP_DATA_SERVICES_MAP } from '@dspace/core/data-services-map-type';
import { ActivatedRouteStub } from '@dspace/core/testing/active-router.stub';
import { BrowserOnlyMockPipe } from '@dspace/core/testing/browser-only-mock.pipe';
import { EPersonMock } from '@dspace/core/testing/eperson.mock';
import { HostWindowServiceStub } from '@dspace/core/testing/host-window-service.stub';
import { XSRFService } from '@dspace/core/xsrf/xsrf.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import {
  Store,
  StoreModule,
} from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { AppState } from '../../app.reducer';
import { HostWindowService } from '../host-window.service';
import { AuthNavMenuComponent } from './auth-nav-menu.component';

describe('AuthNavMenuComponent', () => {

  let component: AuthNavMenuComponent;
  let deNavMenu: DebugElement;
  let deNavMenuItem: DebugElement;
  let fixture: ComponentFixture<AuthNavMenuComponent>;

  let notAuthState: AuthState;
  let authState: AuthState;

  let authService: AuthService;

  let routerState = {
    url: '/home',
  };

  function serviceInit() {
    authService = jasmine.createSpyObj('authService', {
      getAuthenticatedUserFromStore: of(EPersonMock),
      setRedirectUrl: {},
    });
  }

  function init() {
    notAuthState = {
      authenticated: false,
      loaded: false,
      blocking: false,
      loading: false,
      idle: false,
    };
    authState = {
      authenticated: true,
      loaded: true,
      blocking: false,
      loading: false,
      authToken: new AuthTokenInfo('test_token'),
      userId: EPersonMock.id,
      idle: false,
    };
  }

  describe('when is a not mobile view', () => {

    beforeEach(waitForAsync(() => {
      const window = new HostWindowServiceStub(800);
      serviceInit();

      // refine the test module by declaring the test component
      TestBed.configureTestingModule({
        imports: [
          NoopAnimationsModule,
          StoreModule.forRoot(authReducer, {
            runtimeChecks: {
              strictStateImmutability: false,
              strictActionImmutability: false,
            },
          }),
          TranslateModule.forRoot(),
          AuthNavMenuComponent,
          NgbDropdownModule,
          BrowserOnlyMockPipe,
        ],
        providers: [
          { provide: APP_DATA_SERVICES_MAP, useValue: {} },
          { provide: HostWindowService, useValue: window },
          { provide: AuthService, useValue: authService },
          { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
          { provide: XSRFService, useValue: {} },
          { provide: APP_CONFIG, useValue: { cache: { msToLive: { default: 15 * 60 * 1000 } } } },
        ],
        schemas: [
          CUSTOM_ELEMENTS_SCHEMA,
        ],
      })
        .compileComponents();
    }));

    beforeEach(() => {
      init();
    });
    describe('when route is /login and user is not authenticated', () => {
      beforeEach(inject([Store], (store: Store<AppState>) => {
        routerState = {
          url: '/login',
        };
        store
          .subscribe((state) => {
            (state as any).router = Object.create({});
            (state as any).router.state = routerState;
            (state as any).core = Object.create({});
            (state as any).core.auth = notAuthState;
          });

        // create component and test fixture
        fixture = TestBed.createComponent(AuthNavMenuComponent);

        // get test component from the fixture
        component = fixture.componentInstance;

        fixture.detectChanges();

        const navMenuSelector = '[data-test="auth-nav"]';
        deNavMenu = fixture.debugElement.query(By.css(navMenuSelector));

        const navMenuItemSelector = '.nav-item';
        deNavMenuItem = deNavMenu.query(By.css(navMenuItemSelector));
      }));
      afterEach(() => {
        fixture.destroy();
      });
      it('should not render', () => {
        expect(component).toBeTruthy();
        expect(deNavMenu.nativeElement).toBeDefined();
        expect(deNavMenuItem).toBeNull();
      });

    });

    describe('when route is /logout and user is authenticated', () => {
      beforeEach(inject([Store], (store: Store<AppState>) => {
        routerState = {
          url: '/logout',
        };
        store
          .subscribe((state) => {
            (state as any).router = Object.create({});
            (state as any).router.state = routerState;
            (state as any).core = Object.create({});
            (state as any).core.auth = authState;
          });

        // create component and test fixture
        fixture = TestBed.createComponent(AuthNavMenuComponent);

        // get test component from the fixture
        component = fixture.componentInstance;

        fixture.detectChanges();

        const navMenuSelector = '[data-test="auth-nav"]';
        deNavMenu = fixture.debugElement.query(By.css(navMenuSelector));

        const navMenuItemSelector = '.nav-item';
        deNavMenuItem = deNavMenu.query(By.css(navMenuItemSelector));
      }));

      afterEach(() => {
        fixture.destroy();
      });

      it('should not render', () => {
        expect(component).toBeTruthy();
        expect(deNavMenu.nativeElement).toBeDefined();
        expect(deNavMenuItem).toBeNull();
      });

    });

    describe('when route is not /login neither /logout', () => {
      describe('when user is not authenticated', () => {

        beforeEach(inject([Store], (store: Store<AppState>) => {
          routerState = {
            url: '/home',
          };
          store
            .subscribe((state) => {
              (state as any).router = Object.create({});
              (state as any).router.state = routerState;
              (state as any).core = Object.create({});
              (state as any).core.auth = notAuthState;
            });

          // create component and test fixture
          fixture = TestBed.createComponent(AuthNavMenuComponent);

          // get test component from the fixture
          component = fixture.componentInstance;

          fixture.detectChanges();

          const navMenuSelector = '[data-test="auth-nav"]';
          deNavMenu = fixture.debugElement.query(By.css(navMenuSelector));

          const navMenuItemSelector = '.nav-item';
          deNavMenuItem = deNavMenu.query(By.css(navMenuItemSelector));
        }));

        afterEach(() => {
          fixture.destroy();
          component = null;
        });

        it('should render login dropdown menu', () => {
          const loginDropdownMenu = deNavMenuItem.query(By.css('div#loginDropdownMenu'));
          expect(loginDropdownMenu.nativeElement).toBeDefined();
        });
      });

      describe('when user is authenticated', () => {
        beforeEach(inject([Store], (store: Store<AppState>) => {
          routerState = {
            url: '/home',
          };
          store
            .subscribe((state) => {
              (state as any).router = Object.create({});
              (state as any).router.state = routerState;
              (state as any).core = Object.create({});
              (state as any).core.auth = authState;
            });

          // create component and test fixture
          fixture = TestBed.createComponent(AuthNavMenuComponent);

          // get test component from the fixture
          component = fixture.componentInstance;

          fixture.detectChanges();

          const navMenuSelector = '[data-test="auth-nav"]';
          deNavMenu = fixture.debugElement.query(By.css(navMenuSelector));

          const navMenuItemSelector = '.nav-item';
          deNavMenuItem = deNavMenu.query(By.css(navMenuItemSelector));
        }));

        afterEach(() => {
          fixture.destroy();
          component = null;
        });
        it('should render UserMenuComponent component', () => {
          const logoutDropdownMenu = deNavMenuItem.query(By.css('ds-user-menu'));
          expect(logoutDropdownMenu.nativeElement).toBeDefined();
        });
      });
    });
  });

  describe('when is a mobile view', () => {
    beforeEach(waitForAsync(() => {
      const window = new HostWindowServiceStub(300);
      serviceInit();

      // refine the test module by declaring the test component
      TestBed.configureTestingModule({
        imports: [
          NoopAnimationsModule,
          StoreModule.forRoot(authReducer, {
            runtimeChecks: {
              strictStateImmutability: false,
              strictActionImmutability: false,
            },
          }),
          TranslateModule.forRoot(),
          AuthNavMenuComponent,
        ],
        providers: [
          { provide: HostWindowService, useValue: window },
          { provide: AuthService, useValue: authService },
          { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        ],
        schemas: [
          CUSTOM_ELEMENTS_SCHEMA,
        ],
      })
        .compileComponents();

    }));

    beforeEach(() => {
      init();
    });
    describe('when user is not authenticated', () => {

      beforeEach(inject([Store], (store: Store<AppState>) => {
        store
          .subscribe((state) => {
            (state as any).router = Object.create({});
            (state as any).router.state = routerState;
            (state as any).core = Object.create({});
            (state as any).core.auth = notAuthState;
          });

        // create component and test fixture
        fixture = TestBed.createComponent(AuthNavMenuComponent);

        // get test component from the fixture
        component = fixture.componentInstance;

        fixture.detectChanges();

        const navMenuSelector = '[data-test="auth-nav"]';
        deNavMenu = fixture.debugElement.query(By.css(navMenuSelector));
      }));

      afterEach(() => {
        fixture.destroy();
        component = null;
      });

      it('should render login link', () => {
        const loginDropdownMenu = deNavMenu.query(By.css('.loginLink'));
        expect(loginDropdownMenu.nativeElement).toBeDefined();
      });
    });

    describe('when user is authenticated', () => {
      beforeEach(inject([Store], (store: Store<AppState>) => {
        store
          .subscribe((state) => {
            (state as any).router = Object.create({});
            (state as any).router.state = routerState;
            (state as any).core = Object.create({});
            (state as any).core.auth = authState;
          });

        // create component and test fixture
        fixture = TestBed.createComponent(AuthNavMenuComponent);

        // get test component from the fixture
        component = fixture.componentInstance;

        fixture.detectChanges();

        const navMenuSelector = '[data-test="auth-nav"]';
        deNavMenu = fixture.debugElement.query(By.css(navMenuSelector));
      }));

      afterEach(() => {
        fixture.destroy();
        component = null;
      });

      it('should render logout link', inject([Store], (store: Store<AppState>) => {
        const logoutDropdownMenu = deNavMenu.query(By.css('a.logoutLink'));
        expect(logoutDropdownMenu.nativeElement).toBeDefined();
      }));
    });
  });
});
