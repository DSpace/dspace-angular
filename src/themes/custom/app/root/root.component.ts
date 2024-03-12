import { Component } from '@angular/core';

import { RootComponent as BaseComponent } from '../../../../app/root/root.component';
import { ThemedAdminSidebarComponent } from '../../../../app/admin/admin-sidebar/themed-admin-sidebar.component';
import {
  SystemWideAlertBannerComponent
} from '../../../../app/system-wide-alert/alert-banner/system-wide-alert-banner.component';
import {
  ThemedHeaderNavbarWrapperComponent
} from '../../../../app/header-nav-wrapper/themed-header-navbar-wrapper.component';
import { ThemedBreadcrumbsComponent } from '../../../../app/breadcrumbs/themed-breadcrumbs.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { ThemedLoadingComponent } from '../../../../app/shared/loading/themed-loading.component';
import { RouterOutlet } from '@angular/router';
import { ThemedFooterComponent } from '../../../../app/footer/themed-footer.component';
import {
  NotificationsBoardComponent
} from '../../../../app/shared/notifications/notifications-board/notifications-board.component';
import { TranslateModule } from '@ngx-translate/core';
import { slideSidebarPadding } from '../../../../app/shared/animations/slide';

@Component({
  selector: 'ds-root',
  // styleUrls: ['./root.component.scss'],
  styleUrls: ['../../../../app/root/root.component.scss'],
  // templateUrl: './root.component.html',
  templateUrl: '../../../../app/root/root.component.html',
  animations: [slideSidebarPadding],
  standalone: true,
  imports: [TranslateModule, ThemedAdminSidebarComponent, SystemWideAlertBannerComponent, ThemedHeaderNavbarWrapperComponent, ThemedBreadcrumbsComponent, NgIf, ThemedLoadingComponent, RouterOutlet, ThemedFooterComponent, NotificationsBoardComponent, AsyncPipe]
})
export class RootComponent extends BaseComponent {

}
