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
import { AuthService } from '@dspace/core/auth/auth.service';
import { AuthRequestService } from '@dspace/core/auth/auth-request.service';
import { ServerAuthService } from '@dspace/core/auth/server-auth.service';
import { ServerAuthRequestService } from '@dspace/core/auth/server-auth-request.service';
import { CookieService } from '@dspace/core/cookies/cookie.service';
import { OrejimeService } from '@dspace/core/cookies/orejime.service';
import { ServerCookieService } from '@dspace/core/cookies/server-cookie.service';
import { ServerOrejimeService } from '@dspace/core/cookies/server-orejime.service';
import { coreEffects } from '@dspace/core/core.effects';
import { coreReducers } from '@dspace/core/core.reducers';
import { CoreState } from '@dspace/core/core-state.model';
import { ForwardClientIpInterceptor } from '@dspace/core/forward-client-ip/forward-client-ip.interceptor';
import { LocaleService } from '@dspace/core/locale/locale.service';
import { ServerLocaleService } from '@dspace/core/locale/server-locale.service';
import { HardRedirectService } from '@dspace/core/services/hard-redirect.service';
import { ReferrerService } from '@dspace/core/services/referrer.service';
import { ServerReferrerService } from '@dspace/core/services/server.referrer.service';
import { ServerHardRedirectService } from '@dspace/core/services/server-hard-redirect.service';
import { ServerXhrService } from '@dspace/core/services/server-xhr.service';
import { MathService } from '@dspace/core/shared/math.service';
import { ServerMathService } from '@dspace/core/shared/server-math.service';
import { AngularticsProviderMock } from '@dspace/core/testing/angulartics-provider.service.mock';
import { Angulartics2Mock } from '@dspace/core/testing/angulartics2.service.mock';
import { ServerXSRFService } from '@dspace/core/xsrf/server-xsrf.service';
import { XSRFService } from '@dspace/core/xsrf/xsrf.service';
import { EffectsModule } from '@ngrx/effects';
import {
  Action,
  StoreConfig,
  StoreModule,
} from '@ngrx/store';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
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
