import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { MetaReducer, Store, StoreModule, USER_PROVIDED_META_REDUCERS } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { DYNAMIC_MATCHER_PROVIDERS } from '@ng-dynamic-forms/core';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { AdminSidebarSectionComponent } from './+admin/admin-sidebar/admin-sidebar-section/admin-sidebar-section.component';
import { AdminSidebarComponent } from './+admin/admin-sidebar/admin-sidebar.component';
import { ExpandableAdminSidebarSectionComponent } from './+admin/admin-sidebar/expandable-admin-sidebar-section/expandable-admin-sidebar-section.component';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { appEffects } from './app.effects';
import { appMetaReducers, debugMetaReducers } from './app.metareducers';
import { appReducers, AppState, storeModuleConfig } from './app.reducer';
import { CheckAuthenticationTokenAction } from './core/auth/auth.actions';

import { CoreModule } from './core/core.module';
import { ClientCookieService } from './core/services/client-cookie.service';
import { JournalEntitiesModule } from './entity-groups/journal-entities/journal-entities.module';
import { ResearchEntitiesModule } from './entity-groups/research-entities/research-entities.module';
import { FooterComponent } from './footer/footer.component';
import { HeaderNavbarWrapperComponent } from './header-nav-wrapper/header-navbar-wrapper.component';
import { HeaderComponent } from './header/header.component';
import { NavbarModule } from './navbar/navbar.module';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { SearchNavbarComponent } from './search-navbar/search-navbar.component';

import { DSpaceRouterStateSerializer } from './shared/ngrx/dspace-router-state-serializer';
import { NotificationComponent } from './shared/notifications/notification/notification.component';
import { NotificationsBoardComponent } from './shared/notifications/notifications-board/notifications-board.component';
import { SharedModule } from './shared/shared.module';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { environment } from '../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

export function getBase() {
  return environment.ui.nameSpace;
}

export function getMetaReducers(): Array<MetaReducer<AppState>> {
  return environment.debug ? [...appMetaReducers, ...debugMetaReducers] : appMetaReducers;
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
];

const ENTITY_IMPORTS = [
  JournalEntitiesModule,
  ResearchEntitiesModule
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
  ...DYNAMIC_MATCHER_PROVIDERS,
];

const DECLARATIONS = [
  AppComponent,
  HeaderComponent,
  HeaderNavbarWrapperComponent,
  AdminSidebarComponent,
  AdminSidebarSectionComponent,
  ExpandableAdminSidebarSectionComponent,
  FooterComponent,
  PageNotFoundComponent,
  NotificationComponent,
  NotificationsBoardComponent,
  SearchNavbarComponent,
];

const EXPORTS = [
  AppComponent
];

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    ...IMPORTS,
    ...ENTITY_IMPORTS
  ],
  providers: [
    ...PROVIDERS
  ],
  declarations: [
    ...DECLARATIONS,
    BreadcrumbsComponent,
    UnauthorizedComponent,
  ],
  exports: [
    ...EXPORTS
  ],
  entryComponents: [
    AdminSidebarSectionComponent,
    ExpandableAdminSidebarSectionComponent
  ]
})
export class AppModule {

}
