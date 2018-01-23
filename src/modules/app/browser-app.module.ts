import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { IdlePreload, IdlePreloadModule } from 'angular-idle-preload';

import { EffectsModule } from '@ngrx/effects';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from '../../app/app.component';

import { AppModule } from '../../app/app.module';
import { BrowserTransferStateModule } from '../transfer-state/browser-transfer-state.module';

import { TransferState } from '../transfer-state/transfer-state';
import { BrowserTransferStoreEffects } from '../transfer-store/browser-transfer-store.effects';
import { BrowserTransferStoreModule } from '../transfer-store/browser-transfer-store.module';

export function init(cache: TransferState) {
  return () => {
    cache.initialize();
  };
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'ds-app-id'
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
    BrowserAnimationsModule,
    BrowserTransferStateModule,
    BrowserTransferStoreModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    EffectsModule.forRoot([BrowserTransferStoreEffects]),
    AppModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: init,
      deps: [
        TransferState
      ]
    }
  ]
})
export class BrowserAppModule {

}
