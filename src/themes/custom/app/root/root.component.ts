import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ThemedAdminSidebarComponent } from '../../../../app/admin/admin-sidebar/themed-admin-sidebar.component';
import { ThemedBreadcrumbsComponent } from '../../../../app/breadcrumbs/themed-breadcrumbs.component';
import { ThemedFooterComponent } from '../../../../app/footer/themed-footer.component';
import { ThemedHeaderNavbarWrapperComponent } from '../../../../app/header-nav-wrapper/themed-header-navbar-wrapper.component';
import { RootComponent as BaseComponent } from '../../../../app/root/root.component';
import { slideSidebarPadding } from '../../../../app/shared/animations/slide';
import { LiveRegionComponent } from '../../../../app/shared/live-region/live-region.component';
import { ThemedLoadingComponent } from '../../../../app/shared/loading/themed-loading.component';
import { NotificationsBoardComponent } from '../../../../app/shared/notifications/notifications-board/notifications-board.component';
import { SystemWideAlertBannerComponent } from '../../../../app/system-wide-alert/alert-banner/system-wide-alert-banner.component';

@Component({
  selector: 'ds-themed-root',
  // styleUrls: ['./root.component.scss'],
  styleUrls: ['../../../../app/root/root.component.scss'],
  // templateUrl: './root.component.html',
  templateUrl: '../../../../app/root/root.component.html',
  animations: [slideSidebarPadding],
  standalone: true,
  imports: [
    AsyncPipe,
    LiveRegionComponent,
    NgClass,
    NotificationsBoardComponent,
    RouterOutlet,
    SystemWideAlertBannerComponent,
    ThemedAdminSidebarComponent,
    ThemedBreadcrumbsComponent,
    ThemedFooterComponent,
    ThemedHeaderNavbarWrapperComponent,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
export class RootComponent extends BaseComponent {
}
