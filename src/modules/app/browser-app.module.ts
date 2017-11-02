import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IdlePreload, IdlePreloadModule } from '@angularclass/idle-preload';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { EffectsModule } from '@ngrx/effects';

import { TransferState } from '../transfer-state/transfer-state';
import { BrowserTransferStateModule } from '../transfer-state/browser-transfer-state.module';
import { BrowserTransferStoreEffects } from '../transfer-store/browser-transfer-store.effects';
import { BrowserTransferStoreModule } from '../transfer-store/browser-transfer-store.module';

import { AppModule } from '../../app/app.module';
import { CoreModule } from '../../app/core/core.module';

import { AppComponent } from '../../app/app.component';
import { appEffects } from '../../app/app.effects';

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
    EffectsModule.forRoot([...appEffects, BrowserTransferStoreEffects]),
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
