import { NgModule, APP_INITIALIZER } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { IdlePreload, IdlePreloadModule } from '@angularclass/idle-preload';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { EffectsModule } from '@ngrx/effects';

import { TransferState } from '../modules/transfer-state/transfer-state';
import { BrowserCookiesModule } from '../modules/cookies/browser-cookies.module';
import { BrowserDataLoaderModule } from '../modules/data-loader/browser-data-loader.module';
import { BrowserTransferStateModule } from '../modules/transfer-state/browser-transfer-state.module';
import { BrowserTransferStoreEffects } from '../modules/transfer-store/browser-transfer-store.effects';
import { BrowserTransferStoreModule } from '../modules/transfer-store/browser-transfer-store.module';

import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { AppModule } from './app.module';

import { AppComponent } from './app.component';

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
    IdlePreloadModule.forRoot(), // forRoot ensures the providers are only created once
    RouterModule.forRoot([], { useHash: false, preloadingStrategy: IdlePreload }),
    BrowserCookiesModule,
    BrowserDataLoaderModule,
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
