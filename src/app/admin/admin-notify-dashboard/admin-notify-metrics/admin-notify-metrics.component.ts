
import {
  Component,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';
import { AdminNotifyMetricsRow } from '@dspace/config/admin-notify-metrics.config';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import { TranslateModule } from '@ngx-translate/core';

import { NotificationBoxComponent } from '../../../shared/notification-box/notification-box.component';

@Component({
  selector: 'ds-admin-notify-metrics',
  templateUrl: './admin-notify-metrics.component.html',
  standalone: true,
  imports: [
    NotificationBoxComponent,
    TranslateModule,
  ],
})
/**
 * Component used to display the number of notification for each configured box in the notifyMetrics section
 */

export class AdminNotifyMetricsComponent {

  @Input()
  boxesConfig: AdminNotifyMetricsRow[];

  private incomingConfiguration = 'NOTIFY.incoming';
  private involvedItemsSuffix = 'involvedItems';
  private inboundPath = '/inbound';
  private outboundPath = '/outbound';
  private adminSearchPath = '/admin/search';

  constructor(private router: Router) {
  }


  public navigateToSelectedSearchConfig(searchConfig: string) {
    const isRelatedItemsConfig = searchConfig.endsWith(this.involvedItemsSuffix);

    if (isRelatedItemsConfig) {
      this.router.navigate([this.adminSearchPath], {
        queryParams: {
          configuration: searchConfig,
          view: ViewMode.ListElement,
        },
      });

      return;
    }

    const isIncomingConfig = searchConfig.startsWith(this.incomingConfiguration);
    const selectedPath = isIncomingConfig ? this.inboundPath : this.outboundPath;

    this.router.navigate([`${this.router.url}${selectedPath}`], {
      queryParams: {
        configuration: searchConfig,
        view: ViewMode.Table,
      },
    });
  }
}
