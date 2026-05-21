import { APP_BASE_HREF } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  ApplicationConfig,
  DOCUMENT,
  importProvidersFrom,
} from '@angular/core';
import {
  NoPreloading,
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withPreloading,
  withRouterConfig,
} from '@angular/router';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { StoreDevModules } from '@dspace/config/store/devtools';
import { AuthInterceptor } from '@dspace/core/auth/auth.interceptor';
import { ClientCookieService } from '@dspace/core/cookies/client-cookie.service';
import { DspaceRestInterceptor } from '@dspace/core/dspace-rest/dspace-rest.interceptor';
import { LocaleInterceptor } from '@dspace/core/locale/locale.interceptor';
import { LogInterceptor } from '@dspace/core/log/log.interceptor';
import { DSpaceRouterStateSerializer } from '@dspace/core/ngrx/dspace-router-state-serializer';
import {
  models,
  provideCore,
} from '@dspace/core/provide-core';
import { XsrfInterceptor } from '@dspace/core/xsrf/xsrf.interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DYNAMIC_MATCHER_PROVIDERS } from '@ng-dynamic-forms/core';
import { EffectsModule } from '@ngrx/effects';
import {
  RouterStateSerializer,
  StoreRouterConnectingModule,
} from '@ngrx/router-store';
import {
  MetaReducer,
  StoreModule,
  USER_PROVIDED_META_REDUCERS,
} from '@ngrx/store';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { provideEnvironmentNgxMask } from 'ngx-mask';

import { environment } from '../environments/environment';
import { HashedFileMapping } from '../modules/dynamic-hash/hashed-file-mapping';
import { BrowserHashedFileMapping } from '../modules/dynamic-hash/hashed-file-mapping.browser';
import { appEffects } from './app.effects';
import { MENUS } from './app.menus';
import {
  appMetaReducers,
  debugMetaReducers,
} from './app.metareducers';
import {
  appReducers,
  AppState,
  storeModuleConfig,
} from './app.reducer';
import {
  APP_ROUTES,
  APP_ROUTING_CONF,
  APP_ROUTING_SCROLL_CONF,
} from './app-routes';
import { RootModule } from './root.module';

export function getConfig() {
  return environment;
}

const getBaseHref = (document: Document, appConfig: AppConfig): string => {
  const baseTag = document.querySelector('head > base');
  baseTag.setAttribute('href', `${appConfig.ui.nameSpace}${appConfig.ui.nameSpace.endsWith('/') ? '' : '/'}`);
  return baseTag.getAttribute('href');
};

export function getMetaReducers(appConfig: AppConfig): MetaReducer<AppState>[] {
  return appConfig.debug ? [...appMetaReducers, ...debugMetaReducers] : appMetaReducers;
}

export const commonAppConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      ScrollToModule.forRoot(),
      NgbModule,
      // TranslateModule.forRoot(),
      EffectsModule.forRoot(appEffects),
      StoreModule.forRoot(appReducers, storeModuleConfig),
      StoreRouterConnectingModule.forRoot(),
      StoreDevModules,
      RootModule,
    ),
    provideRouter(
      APP_ROUTES,
      withRouterConfig(APP_ROUTING_CONF),
      withInMemoryScrolling(APP_ROUTING_SCROLL_CONF),
      withEnabledBlockingInitialNavigation(),
      withPreloading(NoPreloading),
      withComponentInputBinding(),
    ),
    {
      provide: APP_BASE_HREF,
      useFactory: getBaseHref,
      deps: [DOCUMENT, APP_CONFIG],
    },
    {
      provide: USER_PROVIDED_META_REDUCERS,
      useFactory: getMetaReducers,
      deps: [APP_CONFIG],
    },
    {
      provide: RouterStateSerializer,
      useClass: DSpaceRouterStateSerializer,
    },
    ClientCookieService,
    // register AuthInterceptor as HttpInterceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    // register LocaleInterceptor as HttpInterceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LocaleInterceptor,
      multi: true,
    },
    // register XsrfInterceptor as HttpInterceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: XsrfInterceptor,
      multi: true,
    },
    // register LogInterceptor as HttpInterceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LogInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DspaceRestInterceptor,
      multi: true,
    },
    {
      provide: HashedFileMapping,
      useClass: BrowserHashedFileMapping,
    },
    // register the dynamic matcher used by form. MUST be provided by the app module
    ...DYNAMIC_MATCHER_PROVIDERS,

    // DI-composable menus
    ...MENUS,
    provideEnvironmentNgxMask(),
    provideCore(),
  ],
};


/* Use models object so all decorators are actually called */
const modelList = models;
