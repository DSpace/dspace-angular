import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, makeStateKey, TransferState } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { REQUEST } from '@nguniversal/express-engine/tokens';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateBrowserLoader } from '../../ngx-translate-loaders/translate-browser.loader';

import { IdlePreloadModule } from 'angular-idle-preload';

import { AppComponent } from '../../app/app.component';

import { AppModule } from '../../app/app.module';
import { DSpaceBrowserTransferStateModule } from '../transfer-state/dspace-browser-transfer-state.module';
import { DSpaceTransferState } from '../transfer-state/dspace-transfer-state.service';
import { ClientCookieService } from '../../app/core/services/client-cookie.service';
import { CookieService } from '../../app/core/services/cookie.service';
import { AuthService } from '../../app/core/auth/auth.service';
import { Angulartics2RouterlessModule } from 'angulartics2';
import { SubmissionService } from '../../app/submission/submission.service';
import { StatisticsModule } from '../../app/statistics/statistics.module';
import { BrowserKlaroService } from '../../app/shared/cookies/browser-klaro.service';
import { KlaroService } from '../../app/shared/cookies/klaro.service';
import { HardRedirectService } from '../../app/core/services/hard-redirect.service';
import {
  BrowserHardRedirectService,
  locationProvider,
  LocationToken
} from '../../app/core/services/browser-hard-redirect.service';
import { LocaleService } from '../../app/core/locale/locale.service';
import { GoogleAnalyticsService } from '../../app/statistics/google-analytics.service';
import { AuthRequestService } from '../../app/core/auth/auth-request.service';
import { BrowserAuthRequestService } from '../../app/core/auth/browser-auth-request.service';
import { AppConfig, APP_CONFIG_STATE } from '../../config/app-config.interface';
import { DefaultAppConfig } from '../../config/default-app-config';
import { extendEnvironmentWithAppConfig } from '../../config/config.util';
import { CorrelationIdService } from '../../app/correlation-id/correlation-id.service';

import { environment } from '../../environments/environment';

export const REQ_KEY = makeStateKey<string>('req');

export function createTranslateLoader(transferState: TransferState, http: HttpClient) {
  return new TranslateBrowserLoader(transferState, http, 'assets/i18n/', '.json5');
}

export function getRequest(transferState: TransferState): any {
  return transferState.get<any>(REQ_KEY, {});
}

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'dspace-angular'
    }),
    HttpClientModule,
    // forRoot ensures the providers are only created once
    IdlePreloadModule.forRoot(),
    StatisticsModule.forRoot(),
    Angulartics2RouterlessModule.forRoot(),
    BrowserAnimationsModule,
    DSpaceBrowserTransferStateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [TransferState, HttpClient]
      }
    }),
    AppModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (
        transferState: TransferState,
        dspaceTransferState: DSpaceTransferState,
        correlationIdService: CorrelationIdService
      ) => {
        if (transferState.hasKey<AppConfig>(APP_CONFIG_STATE)) {
          const appConfig = transferState.get<AppConfig>(APP_CONFIG_STATE, new DefaultAppConfig());
          // extend environment with app config for browser
          extendEnvironmentWithAppConfig(environment, appConfig);
        }
        return () =>
          dspaceTransferState.transfer().then((b: boolean) => {
            correlationIdService.initCorrelationId();
            return b;
          });
      },
      deps: [TransferState, DSpaceTransferState, CorrelationIdService],
      multi: true
    },
    {
      provide: REQUEST,
      useFactory: getRequest,
      deps: [TransferState]
    },
    {
      provide: AuthService,
      useClass: AuthService
    },
    {
      provide: CookieService,
      useClass: ClientCookieService
    },
    {
      provide: KlaroService,
      useClass: BrowserKlaroService
    },
    {
      provide: SubmissionService,
      useClass: SubmissionService
    },
    {
      provide: LocaleService,
      useClass: LocaleService
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
      provide: AuthRequestService,
      useClass: BrowserAuthRequestService,
    },
    {
      provide: LocationToken,
      useFactory: locationProvider,
    },
  ]
})
export class BrowserAppModule {
}
