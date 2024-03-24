import { XhrFactory } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  BrowserModule,
  TransferState,
} from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ServerModule,
  ServerTransferStateModule,
} from '@angular/platform-server';
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

import { AppComponent } from '../../app/app.component';
import { AppModule } from '../../app/app.module';
import { storeModuleConfig } from '../../app/app.reducer';
import { AuthService } from '../../app/core/auth/auth.service';
import { AuthRequestService } from '../../app/core/auth/auth-request.service';
import { ServerAuthService } from '../../app/core/auth/server-auth.service';
import { ServerAuthRequestService } from '../../app/core/auth/server-auth-request.service';
import { coreEffects } from '../../app/core/core.effects';
import { coreReducers } from '../../app/core/core.reducers';
import { CoreState } from '../../app/core/core-state.model';
import { ForwardClientIpInterceptor } from '../../app/core/forward-client-ip/forward-client-ip.interceptor';
import { LocaleService } from '../../app/core/locale/locale.service';
import { ServerLocaleService } from '../../app/core/locale/server-locale.service';
import { CookieService } from '../../app/core/services/cookie.service';
import { HardRedirectService } from '../../app/core/services/hard-redirect.service';
import { ReferrerService } from '../../app/core/services/referrer.service';
import { ServerReferrerService } from '../../app/core/services/server.referrer.service';
import { ServerCookieService } from '../../app/core/services/server-cookie.service';
import { ServerHardRedirectService } from '../../app/core/services/server-hard-redirect.service';
import { ServerXhrService } from '../../app/core/services/server-xhr.service';
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

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'dspace-angular',
    }),
    NoopAnimationsModule,
    ServerTransferStateModule,
    StoreModule.forFeature('core', coreReducers, storeModuleConfig as StoreConfig<CoreState, Action>),
    EffectsModule.forFeature(coreEffects),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [TransferState],
      },
    }),
    AppModule,
    ServerModule,
  ],
  providers: [
    ...ServerInitService.providers(),
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
  ],
})
export class ServerAppModule {
}
