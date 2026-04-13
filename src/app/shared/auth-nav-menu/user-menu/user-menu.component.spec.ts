import {
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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
import { EPersonMock } from '@dspace/core/testing/eperson.mock';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import { XSRFService } from '@dspace/core/xsrf/xsrf.service';
import {
  Store,
  StoreModule,
} from '@ngrx/store';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';

import { AppState } from '../../../app.reducer';
import { UserMenuComponent } from './user-menu.component';

describe('UserMenuComponent', () => {

  let component: UserMenuComponent;
  let fixture: ComponentFixture<UserMenuComponent>;
  let deUserMenu: DebugElement;
  let authState: AuthState;
  let authStateLoading: AuthState;
  let authService: AuthService;

  function serviceInit() {
    authService = jasmine.createSpyObj('authService', {
      getAuthenticatedUserFromStore: of(EPersonMock),
    });
  }

  function init() {
    authState = {
      authenticated: true,
      loaded: true,
      blocking: false,
      loading: false,
      authToken: new AuthTokenInfo('test_token'),
      userId: EPersonMock.id,
      idle: false,
    };
    authStateLoading = {
      authenticated: true,
      loaded: true,
      blocking: false,
      loading: true,
      authToken: null,
      userId: EPersonMock.id,
      idle: false,
    };
  }

  beforeEach(waitForAsync(() => {
    serviceInit();
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(authReducer, {
          runtimeChecks: {
            strictStateImmutability: false,
            strictActionImmutability: false,
          },
        }),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        UserMenuComponent,
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: XSRFService, useValue: {} },
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        { provide: APP_CONFIG, useValue: { cache: { msToLive: { default: 15 * 60 * 1000 } } } },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();

  }));

  beforeEach(() => {
    init();
  });

  describe('when auth state is loading', () => {
    beforeEach(inject([Store], (store: Store<AppState>) => {
      store
        .subscribe((state) => {
          (state as any).core = Object.create({});
          (state as any).core.auth = authStateLoading;
        });

      // create component and test fixture
      fixture = TestBed.createComponent(UserMenuComponent);

      // get test component from the fixture
      component = fixture.componentInstance;

      fixture.detectChanges();

      deUserMenu = fixture.debugElement.query(By.css('div'));
    }));

    afterEach(() => {
      fixture.destroy();
    });

    it('should init component properly', () => {
      expect(component).toBeDefined();

      expect(component.loading$).toBeObservable(cold('b', {
        b: true,
      }));

      expect(component.user$).toBeObservable(cold('(c|)', {
        c: EPersonMock,
      }));
      const span = deUserMenu.query(By.css('.dropdown-item-text'));
      expect(span).toBeNull();
    });

  });

  describe('when auth state is not loading', () => {
    beforeEach(inject([Store], (store: Store<AppState>) => {
      store
        .subscribe((state) => {
          (state as any).core = Object.create({});
          (state as any).core.auth = authState;
        });

      // create component and test fixture
      fixture = TestBed.createComponent(UserMenuComponent);

      // get test component from the fixture
      component = fixture.componentInstance;

      fixture.detectChanges();

      deUserMenu = fixture.debugElement.query(By.css('ul#user-menu-dropdown'));
    }));

    afterEach(() => {
      fixture.destroy();
    });

    it('should init component properly', () => {
      expect(component).toBeDefined();

      expect(component.loading$).toBeObservable(cold('b', {
        b: false,
      }));

      expect(component.user$).toBeObservable(cold('(c|)', {
        c: EPersonMock,
      }));

      expect(deUserMenu).toBeDefined();
    });

    it('should display user name and email', () => {
      const username = 'User Test';
      const email = 'test@test.com';
      const span = deUserMenu.query(By.css('.username-email-wrapper'));
      expect(span).toBeDefined();
      expect(span.nativeElement.innerHTML).toContain(username);
      expect(span.nativeElement.innerHTML).toContain(email);
    });

    it('should create logout component', () => {
      const components = fixture.debugElement.query(By.css('[data-test="log-out-component"]'));
      expect(components).toBeTruthy();
    });

    it('should not create logout component', () => {
      component.inExpandableNavbar = true;
      fixture.detectChanges();
      const components = fixture.debugElement.query(By.css('[data-test="log-out-component"]'));
      expect(components).toBeFalsy();
    });

    it('should call onMenuItemClick when li is clicked', () => {
      spyOn(component, 'onMenuItemClick');
      const lis = fixture.debugElement.queryAll(By.css('.ds-menu-item-wrapper'));
      const secondLi = lis[1];
      secondLi.triggerEventHandler('click', {
        preventDefault: () => {/**/
        },
      });
      expect(component.onMenuItemClick).toHaveBeenCalled();
    });

  });

});
