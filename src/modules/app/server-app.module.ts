import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';

import { ApplicationRef, NgModule, APP_BOOTSTRAP_LISTENER } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ServerModule } from '@angular/platform-server';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Request } from 'express';

import { REQUEST } from '@nguniversal/express-engine/tokens';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { TranslateUniversalLoader } from '../translate-universal-loader';

import { ServerTransferStateModule } from '../transfer-state/server-transfer-state.module';
import { TransferState } from '../transfer-state/transfer-state';

import { ServerTransferStoreEffects } from '../transfer-store/server-transfer-store.effects';
import { ServerTransferStoreModule } from '../transfer-store/server-transfer-store.module';

import { AppState } from '../../app/app.reducer';

import { AppModule } from '../../app/app.module';

import { AppComponent } from '../../app/app.component';

import { GLOBAL_CONFIG, GlobalConfig } from '../../config';

export function boot(cache: TransferState, appRef: ApplicationRef, store: Store<AppState>, request: Request, config: GlobalConfig) {
  // authentication mechanism goes here
  return () => {
    appRef.isStable.filter((stable: boolean) => stable).first().subscribe(() => {
      // isStable == true doesn't guarantee that all dispatched actions have been
      // processed yet. So in those cases the store snapshot wouldn't be complete
      // and a rehydrate would leave the app in a broken state
      //
      // This setTimeout without delay schedules the cache.inject() to happen ASAP
      // after everything that's already scheduled, and it solves that problem.
      setTimeout(() => {
        cache.inject();
      }, 0);
      });
  };
}

export function createTranslateLoader() {
  return new TranslateUniversalLoader('dist/assets/i18n/', '.json');
}

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'ds-app-id'
    }),
    RouterModule.forRoot([], {
      useHash: false
    }),
    NoopAnimationsModule,
    ServerTransferStateModule,
    ServerTransferStoreModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: []
      }
    }),
    EffectsModule.forRoot([ServerTransferStoreEffects]),
    ServerModule,
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
