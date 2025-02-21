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
import { AuthService } from '@dspace/core';
import { AuthRequestService } from '@dspace/core';
import { ServerAuthService } from '@dspace/core';
import { ServerAuthRequestService } from '@dspace/core';
import { coreEffects } from '@dspace/core';
import { coreReducers } from '@dspace/core';
import { CoreState } from '@dspace/core';
import { ForwardClientIpInterceptor } from '@dspace/core';
import { LocaleService } from '@dspace/core';
import { ServerLocaleService } from '@dspace/core';
import { CookieService } from '@dspace/core';
import { HardRedirectService } from '@dspace/core';
import { ReferrerService } from '@dspace/core';
import { ServerReferrerService } from '@dspace/core';
import { ServerCookieService } from '@dspace/core';
import { ServerHardRedirectService } from '@dspace/core';
import { ServerXhrService } from '@dspace/core';
import { MathService } from '@dspace/core';
import { ServerMathService } from '@dspace/core';
import { ServerXSRFService } from '@dspace/core';
import { XSRFService } from '@dspace/core';
import { AngularticsProviderMock } from '../../app/shared/mocks/angulartics-provider.service.mock';
import { Angulartics2Mock } from '../../app/shared/mocks/angulartics2.service.mock';
import { Angulartics2DSpace } from '../../app/statistics/angulartics/dspace-provider';
import { ServerSubmissionService } from '../../app/submission/server-submission.service';
import { SubmissionService } from '../../../modules/core/src/lib/core/submission/submission.service';
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
