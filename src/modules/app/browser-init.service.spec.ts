import { InitService } from '../../app/init.service';
import { APP_CONFIG } from 'src/config/app-config.interface';
import { inject, TestBed, waitForAsync } from '@angular/core/testing';
import { GoogleAnalyticsService } from '../../app/statistics/google-analytics.service';
import { MetadataService } from '../../app/core/metadata/metadata.service';
import { BreadcrumbsService } from '../../app/breadcrumbs/breadcrumbs.service';
import { CommonModule } from '@angular/common';
import { Store, StoreModule } from '@ngrx/store';
import { authReducer } from '../../app/core/auth/auth.reducer';
import { storeModuleConfig } from '../../app/app.reducer';
import { AngularticsProviderMock } from '../../app/shared/mocks/angulartics-provider.service.mock';
import { Angulartics2DSpace } from '../../app/statistics/angulartics/dspace-provider';
import { AuthService } from '../../app/core/auth/auth.service';
import { AuthServiceMock } from '../../app/shared/mocks/auth.service.mock';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterMock } from '../../app/shared/mocks/router.mock';
import { MockActivatedRoute } from '../../app/shared/mocks/active-router.mock';
import { MenuService } from '../../app/shared/menu/menu.service';
import { LocaleService } from '../../app/core/locale/locale.service';
import { environment } from '../../environments/environment';
import { provideMockStore } from '@ngrx/store/testing';
import { AppComponent } from '../../app/app.component';
import { RouteService } from '../../app/core/services/route.service';
import { getMockLocaleService } from '../../app/app.component.spec';
import { MenuServiceStub } from '../../app/shared/testing/menu-service.stub';
import { CorrelationIdService } from '../../app/correlation-id/correlation-id.service';
import { KlaroService } from '../../app/shared/cookies/klaro.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../app/shared/mocks/translate-loader.mock';
import { getTestScheduler } from 'jasmine-marbles';
import { ThemeService } from '../../app/shared/theme-support/theme.service';
import { getMockThemeService } from '../../app/shared/mocks/theme-service.mock';
import { BrowserInitService } from './browser-init.service';
import { TransferState } from '@angular/platform-browser';

const initialState = {
  core: {
    auth: {
      loading: false,
      blocking: true,
    }
  }
};

describe('BrowserInitService', () => {
  describe('browser-specific initialization steps', () => {
    let correlationIdServiceSpy;
    let dspaceTransferStateSpy;
    let transferStateSpy;
    let metadataServiceSpy;
    let breadcrumbsServiceSpy;
    let klaroServiceSpy;
    let googleAnalyticsSpy;

    beforeEach(waitForAsync(() => {
      correlationIdServiceSpy = jasmine.createSpyObj('correlationIdServiceSpy', [
        'initCorrelationId',
      ]);
      dspaceTransferStateSpy = jasmine.createSpyObj('dspaceTransferStateSpy', [
        'transfer',
      ]);
      transferStateSpy = jasmine.createSpyObj('dspaceTransferStateSpy', [
        'get', 'hasKey'
      ]);
      breadcrumbsServiceSpy = jasmine.createSpyObj('breadcrumbsServiceSpy', [
        'listenForRouteChanges',
      ]);
      metadataServiceSpy = jasmine.createSpyObj('metadataService', [
        'listenForRouteChange',
      ]);
      klaroServiceSpy = jasmine.createSpyObj('klaroServiceSpy', [
        'initialize',
      ]);
      googleAnalyticsSpy = jasmine.createSpyObj('googleAnalyticsService', [
        'addTrackingIdToPage',
      ]);


      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          StoreModule.forRoot(authReducer, storeModuleConfig),
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderMock
            }
          }),
        ],
        providers: [
          { provide: InitService, useClass: BrowserInitService },
          { provide: CorrelationIdService, useValue: correlationIdServiceSpy },
          { provide: APP_CONFIG, useValue: environment },
          { provide: LocaleService, useValue: getMockLocaleService() },
          { provide: Angulartics2DSpace, useValue: new AngularticsProviderMock() },
          { provide: MetadataService, useValue: metadataServiceSpy },
          { provide: BreadcrumbsService, useValue: breadcrumbsServiceSpy },
          { provide: AuthService, useValue: new AuthServiceMock() },
          { provide: Router, useValue: new RouterMock() },
          { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
          { provide: MenuService, useValue: new MenuServiceStub() },
          { provide: KlaroService, useValue: klaroServiceSpy },
          { provide: GoogleAnalyticsService, useValue: googleAnalyticsSpy },
          { provide: ThemeService, useValue: getMockThemeService() },
          provideMockStore({ initialState }),
          AppComponent,
          RouteService,
          { provide: TransferState, useValue: undefined },
        ]
      });
    }));

    describe('initGoogleÀnalytics', () => {
      it('should call googleAnalyticsService.addTrackingIdToPage()', inject([InitService], (service) => {
        // @ts-ignore
        service.initGoogleAnalytics();
        expect(googleAnalyticsSpy.addTrackingIdToPage).toHaveBeenCalledTimes(1);
      }));
    });

    describe('initKlaro', () => {
      const BLOCKING = {
        t: {  core: { auth: { blocking: true } } },
        f: {  core: { auth: { blocking: false } } },
      };

      it('should not initialize Klaro while auth is blocking', () => {
        getTestScheduler().run(({ cold, flush}) => {
          TestBed.overrideProvider(Store, { useValue: cold('t--t--t--', BLOCKING) });
          const service = TestBed.inject(InitService);

          // @ts-ignore
          service.initKlaro();
          flush();
          expect(klaroServiceSpy.initialize).not.toHaveBeenCalled();
        });
      });


      it('should only initialize Klaro the first time auth is unblocked', () => {
        getTestScheduler().run(({ cold, flush}) => {
          TestBed.overrideProvider(Store, { useValue: cold('t--t--f--t--f--', BLOCKING) });
          const service = TestBed.inject(InitService);

          // @ts-ignore
          service.initKlaro();
          flush();
          expect(klaroServiceSpy.initialize).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});

