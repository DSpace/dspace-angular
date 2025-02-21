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

import { commonAppConfig } from '../../app/app.config';
import { storeModuleConfig } from '../../app/app.reducer';
import { AuthService } from '../../../modules/core/src/lib/core/auth/auth.service';
import { AuthRequestService } from '../../../modules/core/src/lib/core/auth/auth-request.service';
import { ServerAuthService } from '../../../modules/core/src/lib/core/auth/server-auth.service';
import { ServerAuthRequestService } from '../../../modules/core/src/lib/core/auth/server-auth-request.service';
import { coreEffects } from '../../../modules/core/src/lib/core/core.effects';
import { coreReducers } from '../../../modules/core/src/lib/core/core.reducers';
import { CoreState } from '../../../modules/core/src/lib/core/core-state.model';
import { ForwardClientIpInterceptor } from '../../../modules/core/src/lib/core/forward-client-ip/forward-client-ip.interceptor';
import { LocaleService } from '../../../modules/core/src/lib/core/locale/locale.service';
import { ServerLocaleService } from '../../../modules/core/src/lib/core/locale/server-locale.service';
import { CookieService } from '../../../modules/core/src/lib/core/services/cookie.service';
import { HardRedirectService } from '../../../modules/core/src/lib/core/services/hard-redirect.service';
import { ReferrerService } from '../../../modules/core/src/lib/core/services/referrer.service';
import { ServerReferrerService } from '../../../modules/core/src/lib/core/services/server.referrer.service';
import { ServerCookieService } from '../../../modules/core/src/lib/core/services/server-cookie.service';
import { ServerHardRedirectService } from '../../../modules/core/src/lib/core/services/server-hard-redirect.service';
import { ServerXhrService } from '../../../modules/core/src/lib/core/services/server-xhr.service';
import { MathService } from '../../../modules/core/src/lib/core/shared/math.service';
import { ServerMathService } from '../../../modules/core/src/lib/core/shared/server-math.service';
import { ServerXSRFService } from '../../../modules/core/src/lib/core/xsrf/server-xsrf.service';
import { XSRFService } from '../../../modules/core/src/lib/core/xsrf/xsrf.service';
import { AngularticsProviderMock } from '../../app/shared/mocks/angulartics-provider.service.mock';
import { Angulartics2Mock } from '../../app/shared/mocks/angulartics2.service.mock';
import { Angulartics2DSpace } from '../../app/statistics/angulartics/dspace-provider';
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
  ],
}, commonAppConfig);
