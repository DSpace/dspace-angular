import { NgModule } from '@angular/core';
import { Http } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UniversalModule, isBrowser, isNode } from 'angular2-universal/node'; // for AoT we need to manually split universal packages

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateStaticLoader } from 'ng2-translate';

import { AppModule, AppComponent } from './app/app.module';
import { SharedModule } from './app/shared/shared.module';
import { DemoCacheService } from './app/shared/demo-cache.service';
import { CoreModule } from "./app/core/core.module";

// Will be merged into @angular/platform-browser in a later release
// see https://github.com/angular/angular/pull/12322
import { Meta } from './angular2-meta';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

export function getLRU() {
  return new Map();
}
export function getRequest() {
  return Zone.current.get('req') || {};
}
export function getResponse() {
  return Zone.current.get('res') || {};
}

// TODO(gdi2290): refactor into Universal
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
    RouterModule.forRoot([], { useHash: false }),

    CoreModule.forRoot(),
    SharedModule,
    AppModule,
  ],
  providers: [
    { provide: 'isBrowser', useValue: isBrowser },
    { provide: 'isNode', useValue: isNode },

    { provide: 'req', useFactory: getRequest },
    { provide: 'res', useFactory: getResponse },

    { provide: 'LRU', useFactory: getLRU, deps: [] },

    DemoCacheService,

    Meta,
  ]
})
export class MainModule {
  constructor(public cache: DemoCacheService) {

  }

  /**
   * We need to use the arrow function here to bind the context as this is a gotcha
   * in Universal for now until it's fixed
   */
  universalDoDehydrate = (universalCache) => {
    universalCache[DemoCacheService.KEY] = JSON.stringify(this.cache.dehydrate());
  }

  /**
   * Clear the cache after it's rendered
   */
  universalAfterDehydrate = () => {
    // comment out if LRU provided at platform level to be shared between each user
    this.cache.clear();
  }
}
