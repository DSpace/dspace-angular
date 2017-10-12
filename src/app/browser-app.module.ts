import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { IdlePreload, IdlePreloadModule } from '@angularclass/idle-preload';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { EffectsModule } from '@ngrx/effects';

import { TransferState } from '../modules/transfer-state/transfer-state';
import { BrowserTransferStateModule } from '../modules/transfer-state/browser-transfer-state.module';
import { BrowserTransferStoreEffects } from '../modules/transfer-store/browser-transfer-store.effects';
import { BrowserTransferStoreModule } from '../modules/transfer-store/browser-transfer-store.module';

import { AppModule } from './app.module';
import { CoreModule } from './core/core.module';

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
    // forRoot ensures the providers are only created once
    IdlePreloadModule.forRoot(),
    RouterModule.forRoot([], {
      // enableTracing: true,
      useHash: false,
      preloadingStrategy:
      IdlePreload
    }),
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
