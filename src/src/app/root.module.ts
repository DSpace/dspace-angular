import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AdminSidebarComponent } from './admin/admin-sidebar/admin-sidebar.component';
import { AdminSidebarSectionComponent } from './admin/admin-sidebar/admin-sidebar-section/admin-sidebar-section.component';
import { ExpandableAdminSidebarSectionComponent } from './admin/admin-sidebar/expandable-admin-sidebar-section/expandable-admin-sidebar-section.component';
import { ThemedAdminSidebarComponent } from './admin/admin-sidebar/themed-admin-sidebar.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ThemedBreadcrumbsComponent } from './breadcrumbs/themed-breadcrumbs.component';
import { FooterComponent } from './footer/footer.component';
import { ThemedFooterComponent } from './footer/themed-footer.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { ThemedForbiddenComponent } from './forbidden/themed-forbidden.component';
import { ContextHelpToggleComponent } from './header/context-help-toggle/context-help-toggle.component';
import { HeaderComponent } from './header/header.component';
import { ThemedHeaderComponent } from './header/themed-header.component';
import { HeaderNavbarWrapperComponent } from './header-nav-wrapper/header-navbar-wrapper.component';
import { ThemedHeaderNavbarWrapperComponent } from './header-nav-wrapper/themed-header-navbar-wrapper.component';
import { PageErrorComponent } from './page-error/page-error.component';
import { ThemedPageErrorComponent } from './page-error/themed-page-error.component';
import { PageInternalServerErrorComponent } from './page-internal-server-error/page-internal-server-error.component';
import { ThemedPageInternalServerErrorComponent } from './page-internal-server-error/themed-page-internal-server-error.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { ThemedPageNotFoundComponent } from './pagenotfound/themed-pagenotfound.component';
import { RootComponent } from './root/root.component';
import { ThemedRootComponent } from './root/themed-root.component';
import { IdleModalComponent } from './shared/idle-modal/idle-modal.component';
import { NotificationComponent } from './shared/notifications/notification/notification.component';
import { NotificationsBoardComponent } from './shared/notifications/notifications-board/notifications-board.component';

const IMPORTS = [
  CommonModule,
  NgbModule,
];

const PROVIDERS = [
];

const DECLARATIONS = [
  RootComponent,
  ThemedRootComponent,
  HeaderComponent,
  ThemedHeaderComponent,
  HeaderNavbarWrapperComponent,
  ThemedHeaderNavbarWrapperComponent,
  AdminSidebarComponent,
  ThemedAdminSidebarComponent,
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
  ThemedPageErrorComponent,
  PageErrorComponent,
  ContextHelpToggleComponent,
];

const EXPORTS = [
];

@NgModule({
  imports: [
    ...IMPORTS,
    ...DECLARATIONS,
  ],
  providers: [
    ...PROVIDERS,
  ],
  exports: [
    ...EXPORTS,
    ...DECLARATIONS,
  ],
})
export class RootModule {

}
