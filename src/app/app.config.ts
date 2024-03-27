import {
  APP_BASE_HREF,
  DOCUMENT,
} from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
} from '@angular/core';
import {
  NoPreloading,
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withPreloading,
  withRouterConfig,
} from '@angular/router';
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
import { NgxMaskModule } from 'ngx-mask';

import {
  APP_CONFIG,
  AppConfig,
} from '../config/app-config.interface';
import { StoreDevModules } from '../config/store/devtools';
import { environment } from '../environments/environment';
import { EagerThemesModule } from '../themes/eager-themes.module';
import { appEffects } from './app.effects';
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
import { BROWSE_BY_DECORATOR_MAP } from './browse-by/browse-by-switcher/browse-by-decorator';
import { AuthInterceptor } from './core/auth/auth.interceptor';
import { LocaleInterceptor } from './core/locale/locale.interceptor';
import { LogInterceptor } from './core/log/log.interceptor';
import {
  models,
  provideCore,
} from './core/provide-core';
import { ClientCookieService } from './core/services/client-cookie.service';
import { ListableModule } from './core/shared/listable.module';
import { XsrfInterceptor } from './core/xsrf/xsrf.interceptor';
import { RootModule } from './root.module';
import { AUTH_METHOD_FOR_DECORATOR_MAP } from './shared/log-in/methods/log-in.methods-decorator';
import { METADATA_REPRESENTATION_COMPONENT_DECORATOR_MAP } from './shared/metadata-representation/metadata-representation.decorator';
import {
  ADVANCED_WORKFLOW_TASK_OPTION_DECORATOR_MAP,
  WORKFLOW_TASK_OPTION_DECORATOR_MAP,
} from './shared/mydspace-actions/claimed-task/switcher/claimed-task-actions-decorator';
import { DSpaceRouterStateSerializer } from './shared/ngrx/dspace-router-state-serializer';
import { STARTS_WITH_DECORATOR_MAP } from './shared/starts-with/starts-with-decorator';

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
      EagerThemesModule,
      RootModule,
      ListableModule.withEntryComponents(),
      NgxMaskModule.forRoot(),
    ),
    provideRouter(
      APP_ROUTES,
      withRouterConfig(APP_ROUTING_CONF),
      withInMemoryScrolling(APP_ROUTING_SCROLL_CONF),
      withEnabledBlockingInitialNavigation(),
      withPreloading(NoPreloading),
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
    // register the dynamic matcher used by form. MUST be provided by the app module
    ...DYNAMIC_MATCHER_PROVIDERS,
    provideCore(),
  ],
};


/* Use models object so all decorators are actually called */
const modelList = models;
const workflowTasks = WORKFLOW_TASK_OPTION_DECORATOR_MAP;
const advancedWorfklowTasks = ADVANCED_WORKFLOW_TASK_OPTION_DECORATOR_MAP;
const metadataRepresentations = METADATA_REPRESENTATION_COMPONENT_DECORATOR_MAP;
const startsWithDecoratorMap = STARTS_WITH_DECORATOR_MAP;
const browseByDecoratorMap = BROWSE_BY_DECORATOR_MAP;
const authMethodForDecoratorMap = AUTH_METHOD_FOR_DECORATOR_MAP;
