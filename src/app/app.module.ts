import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { META_REDUCERS, MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { TranslateModule } from '@ngx-translate/core';

import { storeFreeze } from 'ngrx-store-freeze';

import { ENV_CONFIG, GLOBAL_CONFIG, GlobalConfig } from '../config';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { appEffects } from './app.effects';
import { appMetaReducers, debugMetaReducers } from './app.metareducers';
import { appReducers, AppState } from './app.reducer';

import { CoreModule } from './core/core.module';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';

import { DSpaceRouterStateSerializer } from './shared/ngrx/dspace-router-state-serializer';
import { NotificationsBoardComponent } from './shared/notifications/notifications-board/notifications-board.component';
import { NotificationComponent } from './shared/notifications/notification/notification.component';
import { SharedModule } from './shared/shared.module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { HeaderNavbarWrapperComponent } from './header-nav-wrapper/header-navbar-wrapper.component';
import { AdminSidebarComponent } from './+admin/admin-sidebar/admin-sidebar.component';
import { AdminSidebarSectionComponent } from './+admin/admin-sidebar/admin-sidebar-section/admin-sidebar-section.component';
import { ExpandableAdminSidebarSectionComponent } from './+admin/admin-sidebar/expandable-admin-sidebar-section/expandable-admin-sidebar-section.component';
import { NavbarModule } from './navbar/navbar.module';
import { JournalEntitiesModule } from './entity-groups/journal-entities/journal-entities.module';
import { ResearchEntitiesModule } from './entity-groups/research-entities/research-entities.module';

export function getConfig() {
  return ENV_CONFIG;
}

export function getBase() {
  return ENV_CONFIG.ui.nameSpace;
}

export function getMetaReducers(config: GlobalConfig): Array<MetaReducer<AppState>> {
  const metaReducers: Array<MetaReducer<AppState>> = config.production ? appMetaReducers : [...appMetaReducers, storeFreeze];
  return config.debug ? [...metaReducers, ...debugMetaReducers] : metaReducers;
}

const IMPORTS = [
  CommonModule,
  SharedModule,
  NavbarModule,
  HttpClientModule,
  AppRoutingModule,
  CoreModule.forRoot(),
  ScrollToModule.forRoot(),
  NgbModule.forRoot(),
  TranslateModule.forRoot(),
  EffectsModule.forRoot(appEffects),
  StoreModule.forRoot(appReducers),
  StoreRouterConnectingModule,
];

const ENTITY_IMPORTS = [
  JournalEntitiesModule,
  ResearchEntitiesModule
];

IMPORTS.push(
  StoreDevtoolsModule.instrument({
    maxAge: 100,
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
    provide: META_REDUCERS,
    useFactory: getMetaReducers,
    deps: [GLOBAL_CONFIG]
  },
  {
    provide: RouterStateSerializer,
    useClass: DSpaceRouterStateSerializer
  }
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
  NotificationsBoardComponent
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
