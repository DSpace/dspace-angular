import { NgModule, APP_INITIALIZER } from '@angular/core';
import { Http } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IdlePreload, IdlePreloadModule } from '@angularclass/idle-preload';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { DSpaceRouterStateSerializer } from './shared/ngrx/dspace-router-state-serializer';

export function init(cache: TransferState) {
  return () => {
    cache.initialize();
  };
}

export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'ds-app-id'
    }),
    IdlePreloadModule.forRoot(), // forRoot ensures the providers are only created once
    RouterModule.forRoot([], { useHash: false, preloadingStrategy: IdlePreload }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    NgbModule.forRoot(),
    BrowserCookiesModule,
    BrowserDataLoaderModule,
    BrowserTransferStateModule,
    BrowserTransferStoreModule,
    EffectsModule.forRoot([BrowserTransferStoreEffects]),
    StoreRouterConnectingModule,
    BrowserAnimationsModule,
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
    },
    {
      provide: RouterStateSerializer,
      useClass: DSpaceRouterStateSerializer
    }
  ]
})
export class BrowserAppModule {

}
