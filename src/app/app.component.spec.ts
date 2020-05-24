import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Store, StoreModule } from '@ngrx/store';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

// Load the implementations that should be tested
import { AppComponent } from './app.component';
import { HostWindowState } from './shared/search/host-window.reducer';
import { HostWindowResizeAction } from './shared/host-window.actions';
import { MetadataService } from './core/metadata/metadata.service';

import { NativeWindowRef, NativeWindowService } from './core/services/window.service';
import { TranslateLoaderMock } from './shared/mocks/translate-loader.mock';
import { MetadataServiceMock } from './shared/mocks/metadata-service.mock';
import { AngularticsMock } from './shared/mocks/angulartics.service.mock';
import { AuthServiceMock } from './shared/mocks/auth.service.mock';
import { AuthService } from './core/auth/auth.service';
import { MenuService } from './shared/menu/menu.service';
import { CSSVariableService } from './shared/sass-helper/sass-helper.service';
import { CSSVariableServiceStub } from './shared/testing/css-variable-service.stub';
import { MenuServiceStub } from './shared/testing/menu-service.stub';
import { HostWindowService } from './shared/host-window.service';
import { HostWindowServiceStub } from './shared/testing/host-window-service.stub';
import { RouteService } from './core/services/route.service';
import { MockActivatedRoute } from './shared/mocks/active-router.mock';
import { RouterMock } from './shared/mocks/router.mock';
import { Angulartics2DSpace } from './statistics/angulartics/dspace-provider';
import { storeModuleConfig } from './app.reducer';
import { LocaleService } from './core/locale/locale.service';

let comp: AppComponent;
let fixture: ComponentFixture<AppComponent>;
let de: DebugElement;
let el: HTMLElement;
const menuService = new MenuServiceStub();

describe('App component', () => {

  function getMockLocaleService(): LocaleService {
    return jasmine.createSpyObj('LocaleService', {
      setCurrentLanguageCode: jasmine.createSpy('setCurrentLanguageCode')
    })
  }

  // async beforeEach
  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [
        CommonModule,
        StoreModule.forRoot({}, storeModuleConfig),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [AppComponent], // declare the test component
      providers: [
        { provide: NativeWindowService, useValue: new NativeWindowRef() },
        { provide: MetadataService, useValue: new MetadataServiceMock() },
        { provide: Angulartics2GoogleAnalytics, useValue: new AngularticsMock() },
        { provide: Angulartics2DSpace, useValue: new AngularticsMock() },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: Router, useValue: new RouterMock() },
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
        { provide: MenuService, useValue: menuService },
        { provide: CSSVariableService, useClass: CSSVariableServiceStub },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(800) },
        { provide: LocaleService, useValue: getMockLocaleService() },
        AppComponent,
        RouteService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);

    comp = fixture.componentInstance; // component test instance
    // query for the <div class='outer-wrapper'> by CSS element selector
    de = fixture.debugElement.query(By.css('div.outer-wrapper'));
    el = de.nativeElement;
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
