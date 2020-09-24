import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule, makeStateKey, TransferState } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { REQUEST } from '@nguniversal/express-engine/tokens';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateJson5HttpLoader } from '../../ngx-translate-loaders/translate-json5-http.loader';

import { IdlePreload, IdlePreloadModule } from 'angular-idle-preload';

import { AppComponent } from '../../app/app.component';

import { AppModule } from '../../app/app.module';
import { DSpaceBrowserTransferStateModule } from '../transfer-state/dspace-browser-transfer-state.module';
import { DSpaceTransferState } from '../transfer-state/dspace-transfer-state.service';
import { ClientCookieService } from '../../app/core/services/client-cookie.service';
import { CookieService } from '../../app/core/services/cookie.service';
import { AuthService } from '../../app/core/auth/auth.service';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { SubmissionService } from '../../app/submission/submission.service';
import { StatisticsModule } from '../../app/statistics/statistics.module';
import { BrowserKlaroService } from '../../app/shared/cookies/browser-klaro.service';
import { KlaroService } from '../../app/shared/cookies/klaro.service';
import { HardRedirectService } from '../../app/core/services/hard-redirect.service';
import {
  BrowserHardRedirectService,
  LocationToken, locationProvider
} from '../../app/core/services/browser-hard-redirect.service';

export const REQ_KEY = makeStateKey<string>('req');

export function createTranslateLoader(http: HttpClient) {
  return new TranslateJson5HttpLoader(http, 'assets/i18n/', '.json5');
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
    RouterModule.forRoot([], {
      // enableTracing: true,
      useHash: false,
      scrollPositionRestoration: 'enabled',
      preloadingStrategy:
      IdlePreload
    }),
    StatisticsModule.forRoot(),
    Angulartics2RouterlessModule.forRoot(),
    BrowserAnimationsModule,
    DSpaceBrowserTransferStateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    AppModule
  ],
  providers: [
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
      provide: HardRedirectService,
      useClass: BrowserHardRedirectService,
    },
    {
      provide: LocationToken,
      useFactory: locationProvider,
    },
  ]
})
export class BrowserAppModule {
  constructor(
    private transferState: DSpaceTransferState,
  ) {
    this.transferState.transfer();
  }
}
