import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServerModule } from '@angular/platform-server';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AppComponent } from '../../app/app.component';

import { AppModule } from '../../app/app.module';
import { DSpaceServerTransferStateModule } from '../transfer-state/dspace-server-transfer-state.module';
import { DSpaceTransferState } from '../transfer-state/dspace-transfer-state.service';

import { TranslateJson5UniversalLoader } from '../../ngx-translate-loaders/translate-json5-universal.loader';
import { CookieService } from '../../app/core/services/cookie.service';
import { ServerCookieService } from '../../app/core/services/server-cookie.service';
import { AuthService } from '../../app/core/auth/auth.service';
import { ServerAuthService } from '../../app/core/auth/server-auth.service';

import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { AngularticsProviderMock } from '../../app/shared/mocks/angulartics-provider.service.mock';
import { SubmissionService } from '../../app/submission/submission.service';
import { ServerSubmissionService } from '../../app/submission/server-submission.service';
import { Angulartics2DSpace } from '../../app/statistics/angulartics/dspace-provider';
import { ServerLocaleService } from '../../app/core/locale/server-locale.service';
import { LocaleService } from '../../app/core/locale/locale.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ForwardClientIpInterceptor } from '../../app/core/forward-client-ip/forward-client-ip.interceptor';
import { HardRedirectService } from '../../app/core/services/hard-redirect.service';
import { ServerHardRedirectService } from '../../app/core/services/server-hard-redirect.service';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2Mock } from '../../app/shared/mocks/angulartics2.service.mock';
import { RouterModule } from '@angular/router';
import { AuthRequestService } from '../../app/core/auth/auth-request.service';
import { ServerAuthRequestService } from '../../app/core/auth/server-auth-request.service';

export function createTranslateLoader() {
  return new TranslateJson5UniversalLoader('dist/server/assets/i18n/', '.json5');
}

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'dspace-angular'
    }),
    RouterModule.forRoot([], {
      useHash: false
    }),
    NoopAnimationsModule,
    DSpaceServerTransferStateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: []
      }
    }),
    ServerModule,
    AppModule
  ],
  providers: [
    {
      provide: Angulartics2,
      useClass: Angulartics2Mock
    },
    {
      provide: Angulartics2GoogleAnalytics,
      useClass: AngularticsProviderMock
    },
    {
      provide: Angulartics2DSpace,
      useClass: AngularticsProviderMock
    },
    {
      provide: AuthService,
      useClass: ServerAuthService
    },
    {
      provide: CookieService,
      useClass: ServerCookieService
    },
    {
      provide: SubmissionService,
      useClass: ServerSubmissionService
    },
    {
      provide: AuthRequestService,
      useClass: ServerAuthRequestService,
    },
    {
      provide: LocaleService,
      useClass: ServerLocaleService
    },
    // register ForwardClientIpInterceptor as HttpInterceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ForwardClientIpInterceptor,
      multi: true
    },
    {
      provide: HardRedirectService,
      useClass: ServerHardRedirectService,
    },
  ]
})
export class ServerAppModule {
  constructor(
    private transferState: DSpaceTransferState,
  ) {
    this.transferState.transfer();
  }
}
