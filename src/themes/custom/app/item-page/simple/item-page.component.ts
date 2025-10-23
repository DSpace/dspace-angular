import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ThemedItemAlertsComponent } from '../../../../../app/item-page/alerts/themed-item-alerts.component';
import { AccessByTokenNotificationComponent } from '../../../../../app/item-page/simple/access-by-token-notification/access-by-token-notification.component';
import { ItemPageComponent as BaseComponent } from '../../../../../app/item-page/simple/item-page.component';
import { NotifyRequestsStatusComponent } from '../../../../../app/item-page/simple/notify-requests-status/notify-requests-status-component/notify-requests-status.component';
import { QaEventNotificationComponent } from '../../../../../app/item-page/simple/qa-event-notification/qa-event-notification.component';
import { ItemVersionsComponent } from '../../../../../app/item-page/versions/item-versions.component';
import { ItemVersionsNoticeComponent } from '../../../../../app/item-page/versions/notice/item-versions-notice.component';
import { fadeInOut } from '../../../../../app/shared/animations/fade';
import { ErrorComponent } from '../../../../../app/shared/error/error.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { ListableObjectComponentLoaderComponent } from '../../../../../app/shared/object-collection/shared/listable-object/listable-object-component-loader.component';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';

@Component({
  selector: 'ds-themed-item-page',
  // styleUrls: ['./item-page.component.scss'],
  styleUrls: ['../../../../../app/item-page/simple/item-page.component.scss'],
  // templateUrl: './item-page.component.html',
  templateUrl: '../../../../../app/item-page/simple/item-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut],
  standalone: true,
  imports: [
    AccessByTokenNotificationComponent,
    AsyncPipe,
    ErrorComponent,
    ItemVersionsComponent,
    ItemVersionsNoticeComponent,
    ListableObjectComponentLoaderComponent,
    NotifyRequestsStatusComponent,
    QaEventNotificationComponent,
    ThemedItemAlertsComponent,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class ItemPageComponent extends BaseComponent {
}
