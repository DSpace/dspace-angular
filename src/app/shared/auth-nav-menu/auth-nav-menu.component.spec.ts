import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';

import { authReducer, AuthState } from '../../core/auth/auth.reducer';
import { EpersonMock } from '../testing/eperson-mock';
import { TranslateModule } from '@ngx-translate/core';
import { AppState } from '../../app.reducer';
import { AuthNavMenuComponent } from './auth-nav-menu.component';
import { HostWindowServiceStub } from '../testing/host-window-service-stub';
import { HostWindowService } from '../host-window.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthTokenInfo } from '../../core/auth/models/auth-token-info.model';

describe('AuthNavMenuComponent', () => {

  let component: AuthNavMenuComponent;
  let deNavMenu: DebugElement;
  let deNavMenuItem: DebugElement;
  let fixture: ComponentFixture<AuthNavMenuComponent>;

  const notAuthState: AuthState = {
    authenticated: false,
    loaded: false,
    loading: false
  };
  const authState: AuthState = {
    authenticated: true,
    loaded: true,
    loading: false,
    authToken: new AuthTokenInfo('test_token'),
    user: EpersonMock
  };
  let routerState = {
    url: '/home'
  };

  describe('when is a not mobile view', () => {
    beforeEach(async(() => {
      const window = new HostWindowServiceStub(800);

      // refine the test module by declaring the test component
      TestBed.configureTestingModule({
        imports: [
          NoopAnimationsModule,
          StoreModule.forRoot(authReducer),
          TranslateModule.forRoot()
        ],
        declarations: [
          AuthNavMenuComponent
        ],
        providers: [
          {provide: HostWindowService, useValue: window},
        ],
        schemas: [
          CUSTOM_ELEMENTS_SCHEMA
        ]
      })
        .compileComponents();

    }));

    describe('when route is /login and user is not authenticated', () => {
      routerState = {
        url: '/login'
      };
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

        const navMenuSelector = '.navbar-nav';
        deNavMenu = fixture.debugElement.query(By.css(navMenuSelector));

        const navMenuItemSelector = 'li';
        deNavMenuItem = deNavMenu.query(By.css(navMenuItemSelector));
      }));

      it('should not render', () => {
        expect(component).toBeTruthy();
        expect(deNavMenu.nativeElement).toBeDefined();
        expect(deNavMenuItem).toBeNull();
      });

    });

    describe('when route is /logout and user is authenticated', () => {
      routerState = {
        url: '/logout'
      };
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

        const navMenuSelector = '.navbar-nav';
        deNavMenu = fixture.debugElement.query(By.css(navMenuSelector));

        const navMenuItemSelector = 'li';
        deNavMenuItem = deNavMenu.query(By.css(navMenuItemSelector));
      }));

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
            url: '/home'
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

          const navMenuSelector = '.navbar-nav';
          deNavMenu = fixture.debugElement.query(By.css(navMenuSelector));

          const navMenuItemSelector = 'li';
          deNavMenuItem = deNavMenu.query(By.css(navMenuItemSelector));
        }));

        it('should render login dropdown menu', () => {
          const loginDropdownMenu = deNavMenuItem.query(By.css('div[id=loginDropdownMenu]'));
          expect(loginDropdownMenu.nativeElement).toBeDefined();
        });
      });

      describe('when user is authenticated', () => {
        beforeEach(inject([Store], (store: Store<AppState>) => {
          routerState = {
            url: '/home'
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

          const navMenuSelector = '.navbar-nav';
          deNavMenu = fixture.debugElement.query(By.css(navMenuSelector));

          const navMenuItemSelector = 'li';
          deNavMenuItem = deNavMenu.query(By.css(navMenuItemSelector));
        }));

        it('should render logout dropdown menu', () => {
          const logoutDropdownMenu = deNavMenuItem.query(By.css('div[id=logoutDropdownMenu]'));
          expect(logoutDropdownMenu.nativeElement).toBeDefined();
        });
      })
    })
  });

  describe('when is a mobile view', () => {
    beforeEach(async(() => {
      const window = new HostWindowServiceStub(300);

      // refine the test module by declaring the test component
      TestBed.configureTestingModule({
        imports: [
          NoopAnimationsModule,
          StoreModule.forRoot(authReducer),
          TranslateModule.forRoot()
        ],
        declarations: [
          AuthNavMenuComponent
        ],
        providers: [
          {provide: HostWindowService, useValue: window},
        ],
        schemas: [
          CUSTOM_ELEMENTS_SCHEMA
        ]
      })
        .compileComponents();

    }));

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

        const navMenuSelector = '.navbar-nav';
        deNavMenu = fixture.debugElement.query(By.css(navMenuSelector));

        const navMenuItemSelector = 'li';
        deNavMenuItem = deNavMenu.query(By.css(navMenuItemSelector));
      }));

      it('should render login link', () => {
        const loginDropdownMenu = deNavMenuItem.query(By.css('a[id=loginLink]'));
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

        const navMenuSelector = '.navbar-nav';
        deNavMenu = fixture.debugElement.query(By.css(navMenuSelector));

        const navMenuItemSelector = 'li';
        deNavMenuItem = deNavMenu.query(By.css(navMenuItemSelector));
      }));

      it('should render logout link', inject([Store], (store: Store<AppState>) => {
        const logoutDropdownMenu = deNavMenuItem.query(By.css('a[id=logoutLink]'));
        expect(logoutDropdownMenu.nativeElement).toBeDefined();
      }));
    })
  })
});
