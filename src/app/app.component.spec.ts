import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { authReducer } from '@dspace/core/auth/auth.reducer';
import { AuthService } from '@dspace/core/auth/auth.service';
import { LocaleService } from '@dspace/core/locale/locale.service';
import { HeadTagService } from '@dspace/core/metadata/head-tag.service';
import { RouteService } from '@dspace/core/services/route.service';
import {
  NativeWindowRef,
  NativeWindowService,
} from '@dspace/core/services/window.service';
import { MockActivatedRoute } from '@dspace/core/testing/active-router.mock';
import { AngularticsProviderMock } from '@dspace/core/testing/angulartics-provider.service.mock';
import { AuthServiceMock } from '@dspace/core/testing/auth.service.mock';
import { CSSVariableServiceStub } from '@dspace/core/testing/css-variable-service.stub';
import { HeadTagServiceMock } from '@dspace/core/testing/head-tag-service.mock';
import { HostWindowServiceStub } from '@dspace/core/testing/host-window-service.stub';
import { RouterMock } from '@dspace/core/testing/router.mock';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  Store,
  StoreModule,
} from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { environment } from '../environments/environment';
// Load the implementations that should be tested
import { AppComponent } from './app.component';
import { storeModuleConfig } from './app.reducer';
import { BreadcrumbsService } from './breadcrumbs/breadcrumbs.service';
import { ThemedRootComponent } from './root/themed-root.component';
import { HostWindowResizeAction } from './shared/host-window.actions';
import { HostWindowService } from './shared/host-window.service';
import { MenuService } from './shared/menu/menu.service';
import { MenuServiceStub } from './shared/menu/menu-service.stub';
import { CSSVariableService } from './shared/sass-helper/css-variable.service';
import { HostWindowState } from './shared/search/host-window.reducer';
import { getMockThemeService } from './shared/theme-support/test/theme-service.mock';
import { ThemeService } from './shared/theme-support/theme.service';
import { Angulartics2DSpace } from './statistics/angulartics/dspace-provider';

let comp: AppComponent;
let fixture: ComponentFixture<AppComponent>;
const menuService = new MenuServiceStub();
const initialState = {
  core: { auth: { loading: false } },
};

export function getMockLocaleService(): LocaleService {
  return jasmine.createSpyObj('LocaleService', {
    setCurrentLanguageCode: jasmine.createSpy('setCurrentLanguageCode'),
  });
}

describe('App component', () => {

  let breadcrumbsServiceSpy;

  const getDefaultTestBedConf = () => {
    breadcrumbsServiceSpy = jasmine.createSpyObj(['listenForRouteChanges']);

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
        { provide: Router, useValue: new RouterMock() },
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
        { provide: MenuService, useValue: menuService },
        { provide: CSSVariableService, useClass: CSSVariableServiceStub },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(800) },
        { provide: LocaleService, useValue: getMockLocaleService() },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: BreadcrumbsService, useValue: breadcrumbsServiceSpy },
        { provide: APP_CONFIG, useValue: environment },
        provideMockStore({ initialState }),
        AppComponent,
        RouteService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    };
  };

  // waitForAsync beforeEach
  beforeEach(waitForAsync(() => {
    return TestBed.configureTestingModule(getDefaultTestBedConf()).overrideComponent(
      AppComponent, {
        remove: {
          imports: [ ThemedRootComponent ],
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
});
