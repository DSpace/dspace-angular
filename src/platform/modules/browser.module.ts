import { Inject, NgModule } from '@angular/core';
import { Http } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UniversalModule, isBrowser, isNode } from 'angular2-universal/browser'; // for AoT we need to manually split universal packages
import { IdlePreload, IdlePreloadModule } from '@angularclass/idle-preload';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateStaticLoader } from 'ng2-translate';

import { AppModule, AppComponent } from '../../app/app.module';
import { SharedModule } from '../../app/shared/shared.module';
import { CoreModule } from '../../app/core/core.module';

import { StoreModule, Store } from "@ngrx/store";
import { RouterStoreModule } from "@ngrx/router-store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { rootReducer, NGRX_CACHE_KEY, AppState } from '../../app/app.reducers';
import { effects } from '../../app/app.effects';

// Will be merged into @angular/platform-browser in a later release
// see https://github.com/angular/angular/pull/12322
import { Meta } from '../angular2-meta';
import { RehydrateStoreAction } from "../../app/store.actions";

import { GLOBAL_CONFIG, GlobalConfig, globalConfig } from '../../config';

// import * as LRU from 'modern-lru';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

export function getLRU(lru?: any) {
  // use LRU for node
  // return lru || new LRU(10);
  return lru || new Map();
}
export function getRequest() {
  // the request object only lives on the server
  return { cookie: document.cookie };
}
export function getResponse() {
  // the response object is sent as the index.html and lives on the server
  return {};
}


export const UNIVERSAL_KEY = 'UNIVERSAL_CACHE';

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
    NgbModule.forRoot(),

    UniversalModule, // BrowserModule, HttpModule, and JsonpModule are included

    FormsModule,
    RouterModule.forRoot([], { useHash: false, preloadingStrategy: IdlePreload }),

    IdlePreloadModule.forRoot(),
    CoreModule.forRoot(),
    SharedModule,
    AppModule,
    StoreModule.provideStore(rootReducer),
    RouterStoreModule.connectRouter(),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    effects
  ],
  providers: [
    { provide: 'isBrowser', useValue: isBrowser },
    { provide: 'isNode', useValue: isNode },

    { provide: 'req', useFactory: getRequest },
    { provide: 'res', useFactory: getResponse },

    { provide: 'LRU', useFactory: getLRU, deps: [] },

    Meta,

    globalConfig

    // { provide: AUTO_PREBOOT, useValue: false } // turn off auto preboot complete
  ]
})
export class MainModule {
  constructor(public store: Store<AppState>, @Inject(GLOBAL_CONFIG) private config: GlobalConfig, ) {
    // TODO(gdi2290): refactor into a lifecycle hook
    this.doRehydrate();
  }

  doRehydrate() {
    if (this.config.universal.shouldRehydrate) {
      let defaultValue = {};
      let serverCache = this._getCacheValue(NGRX_CACHE_KEY, defaultValue);
      this.store.dispatch(new RehydrateStoreAction(serverCache));
    }
  }

  _getCacheValue(key: string, defaultValue: any): any {
    // browser
    const win: any = window;
    if (win[UNIVERSAL_KEY] && win[UNIVERSAL_KEY][key]) {
      let serverCache = defaultValue;
      try {
        serverCache = win[UNIVERSAL_KEY][key];
        if (typeof serverCache !== typeof defaultValue) {
          console.log('Angular Universal: The type of data from the server is different from the default value type');
          serverCache = defaultValue;
        }
      } catch (e) {
        console.log('Angular Universal: There was a problem parsing the server data during rehydrate');
        serverCache = defaultValue;
      }
      return serverCache;
    } else {
      console.log('Angular Universal: UNIVERSAL_CACHE is missing');
    }
    return defaultValue;
  }
}
