import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ThemedItemAlertsComponent } from '../../../../../app/item-page/alerts/themed-item-alerts.component';
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
import { ViewTrackerComponent } from '../../../../../app/statistics/angulartics/dspace/view-tracker.component';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
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
    VarDirective,
    ThemedItemAlertsComponent,
    ItemVersionsNoticeComponent,
    ViewTrackerComponent,
    ListableObjectComponentLoaderComponent,
    ItemVersionsComponent,
    ErrorComponent,
    ThemedLoadingComponent,
    TranslateModule,
    AsyncPipe,
    NgIf,
    NotifyRequestsStatusComponent,
    QaEventNotificationComponent,
  ],
})
export class ItemPageComponent extends BaseComponent {

}
