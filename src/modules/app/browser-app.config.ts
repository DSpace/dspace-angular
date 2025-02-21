import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  APP_ID,
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  makeStateKey,
  mergeApplicationConfig,
  TransferState,
} from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import {
  Action,
  StoreConfig,
  StoreModule,
} from '@ngrx/store';
import {
  MissingTranslationHandler,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import {
  Angulartics2GoogleTagManager,
  Angulartics2RouterlessModule,
} from 'angulartics2';

import { commonAppConfig } from '../../app/app.config';
import { storeModuleConfig } from '../../app/app.reducer';
import { AuthService } from '@dspace/core';
import { AuthRequestService } from '@dspace/core';
import { BrowserAuthRequestService } from '@dspace/core';
import { coreEffects } from '@dspace/core';
import { coreReducers } from '@dspace/core';
import { CoreState } from '@dspace/core';
import { LocaleService } from '@dspace/core';
import { BrowserReferrerService } from '@dspace/core';
import {
  BrowserHardRedirectService,
  locationProvider,
  LocationToken,
} from '@dspace/core';
import { ClientCookieService } from '@dspace/core';
import { CookieService } from '@dspace/core';
import { HardRedirectService } from '@dspace/core';
import { ReferrerService } from '@dspace/core';
import { ClientMathService } from '@dspace/core';
import { MathService } from '@dspace/core';
import { REQUEST } from '@dspace/core';
import { BrowserXSRFService } from '@dspace/core';
import { XSRFService } from '@dspace/core';
import { BrowserOrejimeService } from '../../app/shared/cookies/browser-orejime.service';
import { OrejimeService } from '../../app/shared/cookies/orejime.service';
import { MissingTranslationHelper } from '../../app/shared/translate/missing-translation.helper';
import { GoogleAnalyticsService } from '../../app/statistics/google-analytics.service';
import { SubmissionService } from '../../../modules/core/src/lib/core/submission/submission.service';
import { TranslateBrowserLoader } from '../../ngx-translate-loaders/translate-browser.loader';
import { BrowserInitService } from './browser-init.service';

export const REQ_KEY = makeStateKey<string>('req');

export function createTranslateLoader(transferState: TransferState, http: HttpClient) {
  return new TranslateBrowserLoader(transferState, http, 'assets/i18n/', '.json');
}

export function getRequest(transferState: TransferState): any {
  return transferState.get<any>(REQ_KEY, {});
}

export const browserAppConfig: ApplicationConfig = mergeApplicationConfig({
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideClientHydration(),
    importProvidersFrom(
      // forRoot ensures the providers are only created once
      Angulartics2RouterlessModule.forRoot(),
      StoreModule.forFeature('core', coreReducers, storeModuleConfig as StoreConfig<CoreState, Action>),
      EffectsModule.forFeature(coreEffects),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [TransferState, HttpClient],
        },
        missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MissingTranslationHelper },
        useDefaultLang: true,
      }),
    ),
    ...BrowserInitService.providers(),
    { provide: APP_ID, useValue: 'dspace-angular' },
    {
      provide: REQUEST,
      useFactory: getRequest,
      deps: [TransferState],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (xsrfService: XSRFService, httpClient: HttpClient) => xsrfService.initXSRFToken(httpClient),
      deps: [ XSRFService, HttpClient ],
      multi: true,
    },
    {
      provide: XSRFService,
      useClass: BrowserXSRFService,
    },
    {
      provide: AuthService,
      useClass: AuthService,
    },
    {
      provide: CookieService,
      useClass: ClientCookieService,
    },
    {
      provide: OrejimeService,
      useClass: BrowserOrejimeService,
    },
    {
      provide: SubmissionService,
      useClass: SubmissionService,
    },
    {
      provide: LocaleService,
      useClass: LocaleService,
    },
    {
      provide: HardRedirectService,
      useClass: BrowserHardRedirectService,
    },
    {
      provide: GoogleAnalyticsService,
      useClass: GoogleAnalyticsService,
    },
    {
      provide: Angulartics2GoogleTagManager,
      useClass: Angulartics2GoogleTagManager,
    },
    {
      provide: AuthRequestService,
      useClass: BrowserAuthRequestService,
    },
    {
      provide: ReferrerService,
      useClass: BrowserReferrerService,
    },
    {
      provide: LocationToken,
      useFactory: locationProvider,
    },
    {
      provide: MathService,
      useClass: ClientMathService,
    },
  ],
}, commonAppConfig);
