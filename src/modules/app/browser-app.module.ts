import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule, makeStateKey, TransferState } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { REQUEST } from '@nguniversal/express-engine/tokens';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { IdlePreload, IdlePreloadModule } from 'angular-idle-preload';

import { AppComponent } from '../../app/app.component';

import { AppModule } from '../../app/app.module';
import { DSpaceBrowserTransferStateModule } from '../transfer-state/dspace-browser-transfer-state.module';
import { DSpaceTransferState } from '../transfer-state/dspace-transfer-state.service';
import { ClientCookieService } from '../../app/shared/services/client-cookie.service';
import { CookieService } from '../../app/shared/services/cookie.service';
import { AuthService } from '../../app/core/auth/auth.service';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { ServerSubmissionService } from '../../app/submission/server-submission.service';
import { SubmissionService } from '../../app/submission/submission.service';

export const REQ_KEY = makeStateKey<string>('req');

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export function getRequest(transferState: TransferState): any {
  return transferState.get<any>(REQ_KEY, {})
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
      preloadingStrategy:
      IdlePreload
    }),
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
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
      provide: SubmissionService,
      useClass: SubmissionService
    }
  ]
})
export class BrowserAppModule {
  constructor(
    private transferState: DSpaceTransferState,
  ) {
    this.transferState.transfer();
  }
}
