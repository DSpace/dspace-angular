import { XhrFactory } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  APP_ID,
  ApplicationConfig,
  importProvidersFrom,
  mergeApplicationConfig,
  TransferState,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServerRendering } from '@angular/platform-server';
import {
  AuthService,
  AuthRequestService,
  ServerAuthService,
  ServerAuthRequestService,
  CookieService,
  OrejimeService,
  ServerCookieService,
  ServerOrejimeService,
  coreEffects,
  coreReducers,
  CoreState,
  ForwardClientIpInterceptor,
  LocaleService,
  ServerLocaleService,
  HardRedirectService,
  ReferrerService,
  ServerReferrerService,
  ServerHardRedirectService,
  ServerXhrService,
  MathService,
  ServerMathService,
  AngularticsProviderMock,
  Angulartics2Mock,
  ServerXSRFService,
  XSRFService,
} from '@dspace/core'
import { EffectsModule } from '@ngrx/effects';
import { Action, StoreConfig, StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
  Angulartics2,
  Angulartics2GoogleAnalytics,
  Angulartics2GoogleGlobalSiteTag,
} from 'angulartics2';
import { MatomoTracker } from 'ngx-matomo-client';

import { commonAppConfig } from '../../app/app.config';
import { storeModuleConfig } from '../../app/app.reducer';
import { Angulartics2DSpace } from '../../app/statistics/angulartics/dspace-provider';
import { MockMatomoTracker } from '../../app/statistics/mock-matomo-tracker';
import { ServerSubmissionService } from '../../app/submission/server-submission.service';
import { SubmissionService } from '../../app/submission/submission.service';
import { TranslateServerLoader } from '../../ngx-translate-loaders/translate-server.loader';
import { ServerInitService } from './server-init.service';

export function createTranslateLoader(transferState: TransferState) {
  return new TranslateServerLoader(transferState, 'dist/server/assets/i18n/', '.json');
}

export const serverAppConfig: ApplicationConfig = mergeApplicationConfig({
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideServerRendering(),
    importProvidersFrom(
      StoreModule.forFeature('core', coreReducers, storeModuleConfig as StoreConfig<CoreState, Action>),
      EffectsModule.forFeature(coreEffects),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [TransferState],
        },
      }),
    ),
    ...ServerInitService.providers(),
    { provide: APP_ID, useValue: 'dspace-angular' },
    {
      provide: Angulartics2,
      useClass: Angulartics2Mock,
    },
    {
      provide: Angulartics2GoogleAnalytics,
      useClass: AngularticsProviderMock,
    },
    {
      provide: Angulartics2GoogleGlobalSiteTag,
      useClass: AngularticsProviderMock,
    },
    {
      provide: Angulartics2DSpace,
      useClass: AngularticsProviderMock,
    },
    {
      provide: AuthService,
      useClass: ServerAuthService,
    },
    {
      provide: CookieService,
      useClass: ServerCookieService,
    },
    {
      provide: SubmissionService,
      useClass: ServerSubmissionService,
    },
    {
      provide: AuthRequestService,
      useClass: ServerAuthRequestService,
    },
    {
      provide: XSRFService,
      useClass: ServerXSRFService,
    },
    {
      provide: LocaleService,
      useClass: ServerLocaleService,
    },
    // register ForwardClientIpInterceptor as HttpInterceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ForwardClientIpInterceptor,
      multi: true,
    },
    {
      provide: HardRedirectService,
      useClass: ServerHardRedirectService,
    },
    {
      provide: XhrFactory,
      useClass: ServerXhrService,
    },
    {
      provide: ReferrerService,
      useClass: ServerReferrerService,
    },
    {
      provide: MathService,
      useClass: ServerMathService,
    },
    {
      provide: OrejimeService,
      useClass: ServerOrejimeService,
    },
    {
      provide: MatomoTracker,
      useClass: MockMatomoTracker,
    },
  ],
}, commonAppConfig);
