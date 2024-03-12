import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { storeModuleConfig } from '../app.reducer';
import { authReducer } from '../core/auth/auth.reducer';
import { AuthService } from '../core/auth/auth.service';
import { LocaleService } from '../core/locale/locale.service';
import { MetadataService } from '../core/metadata/metadata.service';
import { RouteService } from '../core/services/route.service';
import {
  NativeWindowRef,
  NativeWindowService,
} from '../core/services/window.service';
import { HostWindowService } from '../shared/host-window.service';
import { MenuService } from '../shared/menu/menu.service';
import { MockActivatedRoute } from '../shared/mocks/active-router.mock';
import { AngularticsProviderMock } from '../shared/mocks/angulartics-provider.service.mock';
import { AuthServiceMock } from '../shared/mocks/auth.service.mock';
import { MetadataServiceMock } from '../shared/mocks/metadata-service.mock';
import { RouterMock } from '../shared/mocks/router.mock';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { CSSVariableService } from '../shared/sass-helper/css-variable.service';
import { CSSVariableServiceStub } from '../shared/testing/css-variable-service.stub';
import { HostWindowServiceStub } from '../shared/testing/host-window-service.stub';
import { MenuServiceStub } from '../shared/testing/menu-service.stub';
import { Angulartics2DSpace } from '../statistics/angulartics/dspace-provider';
import { RootComponent } from './root.component';

describe('RootComponent', () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NoopAnimationsModule,
        StoreModule.forRoot(authReducer, storeModuleConfig),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
      ],
      declarations: [RootComponent], // declare the test component
      providers: [
        { provide: NativeWindowService, useValue: new NativeWindowRef() },
        { provide: MetadataService, useValue: new MetadataServiceMock() },
        { provide: Angulartics2DSpace, useValue: new AngularticsProviderMock() },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: Router, useValue: new RouterMock() },
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
        { provide: MenuService, useValue: new MenuServiceStub() },
        { provide: CSSVariableService, useClass: CSSVariableServiceStub },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(800) },
        { provide: LocaleService, useValue: {} },
        provideMockStore({ core: { auth: { loading: false } } } as any),
        RootComponent,
        RouteService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
