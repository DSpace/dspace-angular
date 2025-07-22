import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  NavigationStart,
  Router,
} from '@angular/router';
import {
  Store,
  StoreModule,
} from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import {
  of,
  Subject,
} from 'rxjs';

import { APP_CONFIG } from '../config/app-config.interface';
import { environment } from '../environments/environment';
// Load the implementations that should be tested
import { AppComponent } from './app.component';
import { storeModuleConfig } from './app.reducer';
import { BreadcrumbsService } from './breadcrumbs/breadcrumbs.service';
import { authReducer } from './core/auth/auth.reducer';
import { AuthService } from './core/auth/auth.service';
import { LocaleService } from './core/locale/locale.service';
import { HeadTagService } from './core/metadata/head-tag.service';
import { RouteService } from './core/services/route.service';
import {
  NativeWindowRef,
  NativeWindowService,
} from './core/services/window.service';
import { ThemedRootComponent } from './root/themed-root.component';
import { KlaroService } from './shared/cookies/klaro.service';
import { DatadogRumService } from './shared/datadog-rum/datadog-rum.service';
import { HostWindowResizeAction } from './shared/host-window.actions';
import { HostWindowService } from './shared/host-window.service';
import { MenuService } from './shared/menu/menu.service';
import { MockActivatedRoute } from './shared/mocks/active-router.mock';
import { AngularticsProviderMock } from './shared/mocks/angulartics-provider.service.mock';
import { AuthServiceMock } from './shared/mocks/auth.service.mock';
import { HeadTagServiceMock } from './shared/mocks/head-tag-service.mock';
import { getMockThemeService } from './shared/mocks/theme-service.mock';
import { TranslateLoaderMock } from './shared/mocks/translate-loader.mock';
import { CSSVariableService } from './shared/sass-helper/css-variable.service';
import { HostWindowState } from './shared/search/host-window.reducer';
import { CSSVariableServiceStub } from './shared/testing/css-variable-service.stub';
import { HostWindowServiceStub } from './shared/testing/host-window-service.stub';
import { MenuServiceStub } from './shared/testing/menu-service.stub';
import { ThemeService } from './shared/theme-support/theme.service';
import { SocialComponent } from './social/social.component';
import { Angulartics2DSpace } from './statistics/angulartics/dspace-provider';

let comp: AppComponent;
let fixture: ComponentFixture<AppComponent>;
const menuService = new MenuServiceStub();
const initialState = {
  core: { auth: { loading: false } },
};

const itemPageUrl = '/entities/publication/3b6ef8e8-15a1-4607-abf8-2a6fbd572346';

export function getMockLocaleService(): LocaleService {
  return jasmine.createSpyObj('LocaleService', {
    setCurrentLanguageCode: jasmine.createSpy('setCurrentLanguageCode'),
  });
}

describe('App component', () => {

  let breadcrumbsServiceSpy;
  let routeServiceMock;
  let klaroServiceSpy: jasmine.SpyObj<KlaroService>;
  let datadogRumServiceSpy: jasmine.SpyObj<DatadogRumService>;
  let routerEventsObs: Subject<any>;
  let routerMock: Router;

  const getDefaultTestBedConf = () => {
    breadcrumbsServiceSpy = jasmine.createSpyObj(['listenForRouteChanges']);
    routeServiceMock = jasmine.createSpyObj('RouterService', {
      getCurrentUrl: of('/home'),
    });

    routerEventsObs = new Subject<any>();
    routerMock = jasmine.createSpyObj([], {
      events: routerEventsObs,
    });

    klaroServiceSpy = jasmine.createSpyObj('KlaroService', {
      getSavedPreferences: jasmine.createSpy('getSavedPreferences'),
      watchConsentUpdates: jasmine.createSpy('watchConsentUpdates').and.returnValue(null),
    },{
      consentsUpdates$: of({}),
    });

    datadogRumServiceSpy = jasmine.createSpyObj('DatadogRumService', {
      initDatadogRum: jasmine.createSpy('initDatadogRum'),
      getDatadogRumState: jasmine.createSpy('getDatadogRumState'),
    });

    return {
      imports: [
        CommonModule,
        StoreModule.forRoot(authReducer, storeModuleConfig),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
      ],
      providers: [
        { provide: NativeWindowService, useValue: new NativeWindowRef() },
        { provide: HeadTagService, useValue: new HeadTagServiceMock() },
        { provide: Angulartics2DSpace, useValue: new AngularticsProviderMock() },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
        { provide: MenuService, useValue: menuService },
        { provide: CSSVariableService, useClass: CSSVariableServiceStub },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(800) },
        { provide: LocaleService, useValue: getMockLocaleService() },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: BreadcrumbsService, useValue: breadcrumbsServiceSpy },
        { provide: RouteService, useValue: routeServiceMock },
        { provide: APP_CONFIG, useValue: environment },
        { provide: KlaroService, useValue: klaroServiceSpy },
        { provide: DatadogRumService, useValue: datadogRumServiceSpy },
        provideMockStore({ initialState }),
        AppComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    };
  };

  // waitForAsync beforeEach
  beforeEach(waitForAsync(() => {
    return TestBed.configureTestingModule(getDefaultTestBedConf()).overrideComponent(
      AppComponent, {
        remove: {
          imports: [ ThemedRootComponent, SocialComponent ],
        },
      },
    );
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance; // component test instance
    fixture.detectChanges();
  });

  it('should create component', inject([AppComponent], (app: AppComponent) => {
    // Perform test using fixture and service
    expect(app).toBeTruthy();
  }));

  describe('when the window is resized', () => {
    let width: number;
    let height: number;
    let store: Store<HostWindowState>;

    beforeEach(() => {
      store = fixture.debugElement.injector.get(Store) as Store<HostWindowState>;
      spyOn(store, 'dispatch');

      window.dispatchEvent(new Event('resize'));
      width = window.innerWidth;
      height = window.innerHeight;
    });

    it('should dispatch a HostWindowResizeAction with the width and height of the window as its payload', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new HostWindowResizeAction(width, height));
    });

  });

  describe('isRouteLoading$ handling', () => {

    it('should not show loading for item page', fakeAsync(() => {
      routeServiceMock.getCurrentUrl.and.returnValue(of(itemPageUrl));
      routerEventsObs.next(new NavigationStart(1, itemPageUrl));
      fixture.detectChanges();
      tick();
      expect(comp.isRouteLoading$.value).toBeFalse();
    }));

    it('should show loading for item page administrative edit', fakeAsync(() => {
      routeServiceMock.getCurrentUrl.and.returnValue(of(itemPageUrl));
      routerEventsObs.next(new NavigationStart(2, itemPageUrl + '/edit'));
      fixture.detectChanges();
      tick();
      expect(comp.isRouteLoading$.value).toBeTrue();
    }));

    it('should not show loading navigating between item pages in administrative edit', fakeAsync(() => {
      routeServiceMock.getCurrentUrl.and.returnValue(of(itemPageUrl + '/edit'));
      routerEventsObs.next(new NavigationStart(2, itemPageUrl + '/edit/status'));
      fixture.detectChanges();
      tick();
      expect(comp.isRouteLoading$.value).toBeFalse();
    }));

  });
});
