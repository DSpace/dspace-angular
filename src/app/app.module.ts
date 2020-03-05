import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { MetaReducer, StoreModule, USER_PROVIDED_META_REDUCERS } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { DYNAMIC_MATCHER_PROVIDERS } from '@ng-dynamic-forms/core';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { ENV_CONFIG, GLOBAL_CONFIG, GlobalConfig } from '../config';
import { AdminSidebarSectionComponent } from './+admin/admin-sidebar/admin-sidebar-section/admin-sidebar-section.component';
import { AdminSidebarComponent } from './+admin/admin-sidebar/admin-sidebar.component';
import { ExpandableAdminSidebarSectionComponent } from './+admin/admin-sidebar/expandable-admin-sidebar-section/expandable-admin-sidebar-section.component';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { appEffects } from './app.effects';
import { appMetaReducers, debugMetaReducers } from './app.metareducers';
import { appReducers, AppState } from './app.reducer';

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

export function getConfig() {
  return ENV_CONFIG;
}

export function getBase() {
  return ENV_CONFIG.ui.nameSpace;
}

export function getMetaReducers(config: GlobalConfig): Array<MetaReducer<AppState>> {
  return config.debug ? [...appMetaReducers, ...debugMetaReducers] : appMetaReducers;
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
  StoreModule.forRoot(appReducers),
  StoreRouterConnectingModule.forRoot(),
];

const ENTITY_IMPORTS = [
  JournalEntitiesModule,
  ResearchEntitiesModule
];

IMPORTS.push(
  StoreDevtoolsModule.instrument({
    maxAge: 1000,
    logOnly: ENV_CONFIG.production,
  })
);

const PROVIDERS = [
  {
    provide: GLOBAL_CONFIG,
    useFactory: (getConfig)
  },
  {
    provide: APP_BASE_HREF,
    useFactory: (getBase)
  },
  {
    provide: USER_PROVIDED_META_REDUCERS,
    useFactory: getMetaReducers,
    deps: [GLOBAL_CONFIG]
  },
  {
    provide: RouterStateSerializer,
    useClass: DSpaceRouterStateSerializer
  },
  ClientCookieService,
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
    ...IMPORTS,
    ...ENTITY_IMPORTS
  ],
  providers: [
    ...PROVIDERS
  ],
  declarations: [
    ...DECLARATIONS,
    BreadcrumbsComponent,
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
