import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServerModule } from '@angular/platform-server';
import { RouterModule } from '@angular/router';

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
import { AngularticsMock } from '../../app/shared/mocks/mock-angulartics.service';
import { SubmissionService } from '../../app/submission/submission.service';
import { ServerSubmissionService } from '../../app/submission/server-submission.service';

export function createTranslateLoader() {
  return new TranslateJson5UniversalLoader('dist/assets/i18n/', '.json5');
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
      provide: Angulartics2GoogleAnalytics,
      useClass: AngularticsMock
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
    }
  ]
})
export class ServerAppModule {
  constructor(
    private transferState: DSpaceTransferState,
  ) {
    this.transferState.transfer();
  }
}
