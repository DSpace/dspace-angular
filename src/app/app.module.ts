import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { MetaReducer, Store, StoreModule, USER_PROVIDED_META_REDUCERS } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  DYNAMIC_ERROR_MESSAGES_MATCHER,
  DYNAMIC_MATCHER_PROVIDERS,
  DynamicErrorMessagesMatcher
} from '@ng-dynamic-forms/core';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { AdminSidebarSectionComponent } from './admin/admin-sidebar/admin-sidebar-section/admin-sidebar-section.component';
import { AdminSidebarComponent } from './admin/admin-sidebar/admin-sidebar.component';
import { ExpandableAdminSidebarSectionComponent } from './admin/admin-sidebar/expandable-admin-sidebar-section/expandable-admin-sidebar-section.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { appEffects } from './app.effects';
import { appMetaReducers, debugMetaReducers } from './app.metareducers';
import { appReducers, AppState, storeModuleConfig } from './app.reducer';
import { CheckAuthenticationTokenAction } from './core/auth/auth.actions';
import { CoreModule } from './core/core.module';
import { ClientCookieService } from './core/services/client-cookie.service';
import { FooterComponent } from './footer/footer.component';
import { HeaderNavbarWrapperComponent } from './header-nav-wrapper/header-navbar-wrapper.component';
import { HeaderComponent } from './header/header.component';
import { NavbarModule } from './navbar/navbar.module';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { DSpaceRouterStateSerializer } from './shared/ngrx/dspace-router-state-serializer';
import { NotificationComponent } from './shared/notifications/notification/notification.component';
import { NotificationsBoardComponent } from './shared/notifications/notifications-board/notifications-board.component';
import { SharedModule } from './shared/shared.module';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { environment } from '../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { ForbiddenComponent } from './forbidden/forbidden.component';
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

import { UUIDService } from './core/shared/uuid.service';
import { CookieService } from './core/services/cookie.service';
import { AbstractControl } from '@angular/forms';

export function getBase() {
  return environment.ui.nameSpace;
}

export function getMetaReducers(): MetaReducer<AppState>[] {
  return environment.debug ? [...appMetaReducers, ...debugMetaReducers] : appMetaReducers;
}

/**
 * Condition for displaying error messages on email form field
 */
export const ValidateEmailErrorStateMatcher: DynamicErrorMessagesMatcher =
  (control: AbstractControl, model: any, hasFocus: boolean) => {
    return (control.touched && !hasFocus) || (control.errors?.emailTaken && hasFocus);
  };

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
  ThemedEntryComponentModule.withEntryComponents(),
];

IMPORTS.push(
  StoreDevtoolsModule.instrument({
    maxAge: 1000,
    logOnly: environment.production,
  })
);

const PROVIDERS = [
  {
    provide: APP_BASE_HREF,
    useFactory: (getBase)
  },
  {
    provide: USER_PROVIDED_META_REDUCERS,
    useFactory: getMetaReducers,
  },
  {
    provide: RouterStateSerializer,
    useClass: DSpaceRouterStateSerializer
  },
  ClientCookieService,
  // Check the authentication token when the app initializes
  {
    provide: APP_INITIALIZER,
    useFactory: (store: Store<AppState>,) => {
      return () => store.dispatch(new CheckAuthenticationTokenAction());
    },
    deps: [ Store ],
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
  // insert the unique id of the user that is using the application utilizing cookies
  {
   provide: APP_INITIALIZER,
    useFactory: (cookieService: CookieService, uuidService: UUIDService) => {
      const correlationId = cookieService.get('CORRELATION-ID');

      // Check if cookie exists, if don't, set it with unique id
      if (!correlationId) {
        cookieService.set('CORRELATION-ID', uuidService.generate());
      }
      return () => true;
    },
   multi: true,
   deps: [ CookieService, UUIDService ]
  },
  {
    provide: DYNAMIC_ERROR_MESSAGES_MATCHER,
    useValue: ValidateEmailErrorStateMatcher
  },
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
  IdleModalComponent
];

const EXPORTS = [
];

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
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
