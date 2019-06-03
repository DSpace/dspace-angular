import * as tslib_1 from "tslib";
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { META_REDUCERS, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateModule } from '@ngx-translate/core';
import { storeFreeze } from 'ngrx-store-freeze';
import { ENV_CONFIG, GLOBAL_CONFIG } from '../config';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { appEffects } from './app.effects';
import { appMetaReducers, debugMetaReducers } from './app.metareducers';
import { appReducers } from './app.reducer';
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
export function getConfig() {
    return ENV_CONFIG;
}
export function getBase() {
    return ENV_CONFIG.ui.nameSpace;
}
export function getMetaReducers(config) {
    var metaReducers = config.production ? appMetaReducers : appMetaReducers.concat([storeFreeze]);
    return config.debug ? metaReducers.concat(debugMetaReducers) : metaReducers;
}
var IMPORTS = [
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
IMPORTS.push(StoreDevtoolsModule.instrument({
    maxAge: 100,
    logOnly: ENV_CONFIG.production,
}));
var PROVIDERS = [
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
var DECLARATIONS = [
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
var EXPORTS = [
    AppComponent
];
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib_1.__decorate([
        NgModule({
            imports: IMPORTS.slice(),
            providers: PROVIDERS.slice(),
            declarations: DECLARATIONS.slice(),
            exports: EXPORTS.slice(),
            entryComponents: [
                AdminSidebarSectionComponent,
                ExpandableAdminSidebarSectionComponent
            ]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map