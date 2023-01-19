import { APP_BASE_HREF, CommonModule, DOCUMENT } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { MetaReducer, StoreModule, USER_PROVIDED_META_REDUCERS } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { DYNAMIC_MATCHER_PROVIDERS } from '@ng-dynamic-forms/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { appEffects } from './app.effects';
import { appMetaReducers, debugMetaReducers } from './app.metareducers';
import { appReducers, AppState, storeModuleConfig } from './app.reducer';
import { CoreModule } from './core/core.module';
import { ClientCookieService } from './core/services/client-cookie.service';
import { NavbarModule } from './navbar/navbar.module';
import { DSpaceRouterStateSerializer } from './shared/ngrx/dspace-router-state-serializer';
import { SharedModule } from './shared/shared.module';
import { environment } from '../environments/environment';
import { AuthInterceptor } from './core/auth/auth.interceptor';
import { LocaleInterceptor } from './core/locale/locale.interceptor';
import { XsrfInterceptor } from './core/xsrf/xsrf.interceptor';
import { LogInterceptor } from './core/log/log.interceptor';
import { RootComponent } from './root/root.component';
import { ThemedRootComponent } from './root/themed-root.component';
import { ThemedEntryComponentModule } from '../themes/themed-entry-component.module';
import { ThemedPageNotFoundComponent } from './pagenotfound/themed-pagenotfound.component';
import { ThemedForbiddenComponent } from './forbidden/themed-forbidden.component';
import { ThemedHeaderComponent } from './header/themed-header.component';
import { ThemedFooterComponent } from './footer/themed-footer.component';
import { ThemedBreadcrumbsComponent } from './breadcrumbs/themed-breadcrumbs.component';
import { ThemedHeaderNavbarWrapperComponent } from './header-nav-wrapper/themed-header-navbar-wrapper.component';
import { IdleModalComponent } from './shared/idle-modal/idle-modal.component';
import { ThemedPageInternalServerErrorComponent } from './page-internal-server-error/themed-page-internal-server-error.component';
import { PageInternalServerErrorComponent } from './page-internal-server-error/page-internal-server-error.component';
import { DtqTestExampleComponent } from './dtq-test-example/dtq-test-example.component';

import { APP_CONFIG, AppConfig } from '../config/app-config.interface';
import { ClarinNavbarTopComponent } from './clarin-navbar-top/clarin-navbar-top.component';
import {ScriptLoaderService} from './clarin-navbar-top/script-loader-service';

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

const IMPORTS = [
  CommonModule,
  SharedModule,
  NavbarModule,
  HttpClientModule,
  AppRoutingModule,
  CoreModule.forRoot(),
  ScrollToModule.forRoot(),
  NgbModule,
  TranslateModule.forRoot(),
  EffectsModule.forRoot(appEffects),
  StoreModule.forRoot(appReducers, storeModuleConfig),
  StoreRouterConnectingModule.forRoot(),
  StoreDevModules,
  EagerThemesModule,
  RootModule,
];

const PROVIDERS = [
  {
    provide: APP_BASE_HREF,
    useFactory: getBaseHref,
    deps: [DOCUMENT, APP_CONFIG]
  },
  {
    provide: USER_PROVIDED_META_REDUCERS,
    useFactory: getMetaReducers,
    deps: [APP_CONFIG]
  },
  {
    provide: RouterStateSerializer,
    useClass: DSpaceRouterStateSerializer
  },
  ClientCookieService,
  ScriptLoaderService,
  // Check the authentication token when the app initializes
  {
    provide: APP_INITIALIZER,
    useFactory: (store: Store<AppState>,) => {
      return () => store.dispatch(new CheckAuthenticationTokenAction());
    },
    deps: [Store],
    multi: true
  },
  // register AuthInterceptor as HttpInterceptor
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
  // register LocaleInterceptor as HttpInterceptor
  {
    provide: HTTP_INTERCEPTORS,
    useClass: LocaleInterceptor,
    multi: true
  },
  // register XsrfInterceptor as HttpInterceptor
  {
    provide: HTTP_INTERCEPTORS,
    useClass: XsrfInterceptor,
    multi: true
  },
  // register LogInterceptor as HttpInterceptor
  {
    provide: HTTP_INTERCEPTORS,
    useClass: LogInterceptor,
    multi: true
  },
  // register the dynamic matcher used by form. MUST be provided by the app module
  ...DYNAMIC_MATCHER_PROVIDERS,
];

const DECLARATIONS = [
  AppComponent,
  RootComponent,
  ThemedRootComponent,
  HeaderComponent,
  ThemedHeaderComponent,
  HeaderNavbarWrapperComponent,
  ThemedHeaderNavbarWrapperComponent,
  AdminSidebarComponent,
  AdminSidebarSectionComponent,
  ExpandableAdminSidebarSectionComponent,
  FooterComponent,
  ThemedFooterComponent,
  PageNotFoundComponent,
  ThemedPageNotFoundComponent,
  NotificationComponent,
  NotificationsBoardComponent,
  BreadcrumbsComponent,
  ThemedBreadcrumbsComponent,
  ForbiddenComponent,
  ThemedForbiddenComponent,
  IdleModalComponent,
  ThemedPageInternalServerErrorComponent,
  PageInternalServerErrorComponent,
  DtqTestExampleComponent,
  ClarinNavbarTopComponent,
];

const EXPORTS = [
];

@NgModule({
  imports: [
    BrowserModule.withServerTransition({appId: 'dspace-angular'}),
    ...IMPORTS
  ],
  providers: [
    ...PROVIDERS
  ],
  declarations: [
    ...DECLARATIONS,
  ],
  exports: [
    ...EXPORTS,
    ...DECLARATIONS,
  ]
})
export class AppModule {

}
