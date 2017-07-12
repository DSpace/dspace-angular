import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';

import { ApplicationRef, Inject, NgModule, APP_BOOTSTRAP_LISTENER } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ServerModule } from '@angular/platform-server';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Request } from 'express';

import { REQUEST } from '@nguniversal/express-engine/tokens';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Store } from "@ngrx/store";
import { Actions, EffectsModule } from '@ngrx/effects';

import { TranslateUniversalLoader } from '../modules/translate-universal-loader';

import { ServerTransferStateModule } from '../modules/transfer-state/server-transfer-state.module';
import { TransferState } from '../modules/transfer-state/transfer-state';

import { TransferStoreEffects } from '../modules/transfer-store/transfer-store.effects';
import { ServerTransferStoreEffects } from '../modules/transfer-store/server-transfer-store.effects';
import { ServerTransferStoreModule } from '../modules/transfer-store/server-transfer-store.module';

import { ServerCookiesModule } from '../modules/cookies/server-cookies.module';

import { ServerDataLoaderModule } from '../modules/data-loader/server-data-loader.module';

import { AppState } from './app.reducer';
import { effects } from './app.effects';

import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { AppModule } from './app.module';

import { AppComponent } from './app.component';

import { GLOBAL_CONFIG, GlobalConfig } from '../config';

export function boot(cache: TransferState, appRef: ApplicationRef, store: Store<AppState>, request: Request, config: GlobalConfig) {
  // authentication mechanism goes here
  return () => {
    appRef.isStable.filter((stable: boolean) => stable).first().subscribe(() => {
      cache.inject();
    });
  };
}
export function UniversalLoaderFactory() {
  return new TranslateUniversalLoader('dist/assets/i18n', '.json');
}

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'ds-app-id'
    }),
    RouterModule.forRoot([], { useHash: false }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: UniversalLoaderFactory,
        deps: []
      }
    }),
    NgbModule.forRoot(),
    ServerModule,
    ServerCookiesModule,
    ServerDataLoaderModule,
    ServerTransferStateModule,
    ServerTransferStoreModule,
    EffectsModule.run(ServerTransferStoreEffects),
    NoopAnimationsModule,
    AppModule
  ],
  providers: [
    {
      provide: APP_BOOTSTRAP_LISTENER,
      multi: true,
      useFactory: boot,
      deps: [
        TransferState,
        ApplicationRef,
        Store,
        REQUEST,
        GLOBAL_CONFIG
      ]
    }
  ]
})
export class ServerAppModule {

}
